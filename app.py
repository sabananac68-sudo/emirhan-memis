from __future__ import annotations

import asyncio
import json
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path
from xml.sax.saxutils import escape as xml_escape

import httpx
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="IETT Vehicle Tracking API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

STATIC_DIR = Path(__file__).parent / "static"
ARCHIVE_DIR = Path(__file__).parent / "archive"
ARCHIVE_DIR.mkdir(exist_ok=True)

ENDPOINTS = {
    "hat_durak": "https://api.ibb.gov.tr/iett/UlasimAnaVeri/HatDurakGuzergah.asmx",
    "duyurular": "https://api.ibb.gov.tr/iett/UlasimDinamikVeri/Duyurular.asmx",
    "sefer": "https://api.ibb.gov.tr/iett/FiloDurum/SeferGerceklesme.asmx",
    "ibb": "https://api.ibb.gov.tr/iett/ibb/ibb.asmx",
    "planlanan": "https://api.ibb.gov.tr/iett/UlasimAnaVeri/PlanlananSeferSaati.asmx",
}

TIMEOUT = httpx.Timeout(30.0, connect=10.0)


def _soap_envelope(action: str, params: str = "") -> str:
    return (
        '<?xml version="1.0" encoding="utf-8"?>'
        '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"'
        ' xmlns:tns="http://tempuri.org/">'
        "<soap:Body>"
        f"<tns:{action}>{params}</tns:{action}>"
        "</soap:Body></soap:Envelope>"
    )


async def _soap_call_json(endpoint: str, action: str, params: str = "") -> list | dict:
    body = _soap_envelope(action, params)
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        resp = await client.post(
            endpoint,
            content=body,
            headers={
                "Content-Type": "text/xml; charset=utf-8",
                "SOAPAction": f"http://tempuri.org/{action}",
            },
        )
    text = resp.text
    start = text.find("[")
    end = text.rfind("]") + 1
    if start >= 0 and end > start:
        return json.loads(text[start:end])
    start = text.find("{")
    end = text.rfind("}") + 1
    if start >= 0 and end > start:
        return json.loads(text[start:end])
    return []


async def _soap_call_xml(endpoint: str, action: str, params: str = "") -> list[dict]:
    body = _soap_envelope(action, params)
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        resp = await client.post(
            endpoint,
            content=body,
            headers={
                "Content-Type": "text/xml; charset=utf-8",
                "SOAPAction": f"http://tempuri.org/{action}",
            },
        )
    root = ET.fromstring(resp.text)
    rows: list[dict] = []
    for elem in root.iter():
        tag = elem.tag.split("}")[-1] if "}" in elem.tag else elem.tag
        if tag == "Table":
            row: dict = {}
            for child in elem:
                ctag = child.tag.split("}")[-1] if "}" in child.tag else child.tag
                row[ctag] = child.text
            if row:
                rows.append(row)
    return rows


@app.get("/")
async def index():
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/travel-time")
async def travel_time_page():
    return FileResponse(STATIC_DIR / "travel-time.html")


@app.get("/api/hat")
async def get_hat(kod: str = Query("", description="Hat kodu (boş=tümü)")):
    data = await _soap_call_json(
        ENDPOINTS["hat_durak"],
        "GetHat_json",
        f"<tns:HatKodu>{xml_escape(kod)}</tns:HatKodu>",
    )
    return JSONResponse(data)


@app.get("/api/durak")
async def get_durak(kod: str = Query("", description="Durak kodu (boş=tümü)")):
    data = await _soap_call_json(
        ENDPOINTS["hat_durak"],
        "GetDurak_json",
        f"<tns:DurakKodu>{xml_escape(kod)}</tns:DurakKodu>",
    )
    return JSONResponse(data)


@app.get("/api/durak-detay")
async def get_durak_detay(hat_kodu: str = Query(..., description="Hat kodu")):
    data = await _soap_call_xml(
        ENDPOINTS["ibb"],
        "DurakDetay_GYY",
        f"<tns:hat_kodu>{xml_escape(hat_kodu)}</tns:hat_kodu>",
    )
    return JSONResponse(data)


@app.get("/api/arac-konum")
async def get_arac_konum(hat_kodu: str = Query(..., description="Hat kodu")):
    data = await _soap_call_json(
        ENDPOINTS["sefer"],
        "GetHatOtoKonum_json",
        f"<tns:HatKodu>{xml_escape(hat_kodu)}</tns:HatKodu>",
    )
    return JSONResponse(data)


@app.get("/api/filo-konum")
async def get_filo_konum():
    data = await _soap_call_json(
        ENDPOINTS["sefer"],
        "GetFiloAracKonum_json",
    )
    return JSONResponse(data)


@app.get("/api/duyurular")
async def get_duyurular():
    data = await _soap_call_json(
        ENDPOINTS["duyurular"],
        "GetDuyurular_json",
    )
    return JSONResponse(data)


@app.get("/api/planlanan-sefer")
async def get_planlanan_sefer(hat_kodu: str = Query(..., description="Hat kodu")):
    data = await _soap_call_json(
        ENDPOINTS["planlanan"],
        "GetPlanlananSeferSaati_json",
        f"<tns:HatKodu>{xml_escape(hat_kodu)}</tns:HatKodu>",
    )
    return JSONResponse(data)


@app.get("/api/garaj")
async def get_garaj():
    data = await _soap_call_json(
        ENDPOINTS["hat_durak"],
        "GetGaraj_json",
    )
    return JSONResponse(data)


# ===== Archive System =====

ARCHIVE_ROUTES = ["86V"]  # Routes to archive
ARCHIVE_INTERVAL = 60  # seconds between snapshots


def _archive_path(hat_kodu: str, date_str: str) -> Path:
    return ARCHIVE_DIR / f"{hat_kodu}_{date_str}.jsonl"


async def _archive_snapshot():
    """Save a snapshot of vehicle positions for archived routes."""
    now = datetime.now(timezone.utc)
    date_str = now.strftime("%Y-%m-%d")
    ts = now.isoformat()

    for route in ARCHIVE_ROUTES:
        try:
            data = await _soap_call_json(
                ENDPOINTS["sefer"],
                "GetHatOtoKonum_json",
                f"<tns:HatKodu>{xml_escape(route)}</tns:HatKodu>",
            )
            if not data:
                continue
            record = {"ts": ts, "hat": route, "araclar": data}
            path = _archive_path(route, date_str)
            with open(path, "a", encoding="utf-8") as f:
                f.write(json.dumps(record, ensure_ascii=False) + "\n")
        except Exception:
            pass


async def _archive_loop():
    """Background task that periodically archives vehicle positions."""
    while True:
        await _archive_snapshot()
        await asyncio.sleep(ARCHIVE_INTERVAL)


@app.on_event("startup")
async def start_archiver():
    asyncio.create_task(_archive_loop())


@app.get("/api/arsiv/tarihler")
async def get_archive_dates(hat_kodu: str = Query("86V", description="Hat kodu")):
    """List available archive dates for a route."""
    dates = []
    for f in sorted(ARCHIVE_DIR.glob(f"{hat_kodu}_*.jsonl")):
        date_part = f.stem.replace(f"{hat_kodu}_", "")
        dates.append(date_part)
    return JSONResponse(dates)


@app.get("/api/arsiv")
async def get_archive(
    hat_kodu: str = Query("86V", description="Hat kodu"),
    tarih: str = Query("", description="Tarih (YYYY-MM-DD)"),
):
    """Get archived vehicle snapshots for a route and date."""
    if not tarih:
        tarih = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    path = _archive_path(hat_kodu, tarih)
    if not path.exists():
        return JSONResponse([])
    records = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                records.append(json.loads(line))
    return JSONResponse(records)


@app.get("/api/arsiv/arac")
async def get_archive_vehicle(
    hat_kodu: str = Query("86V", description="Hat kodu"),
    tarih: str = Query("", description="Tarih (YYYY-MM-DD)"),
    kapi_no: str = Query("", description="Kapı no"),
):
    """Get archived positions for a specific vehicle."""
    if not tarih:
        tarih = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    path = _archive_path(hat_kodu, tarih)
    if not path.exists():
        return JSONResponse([])
    vehicle_history: list[dict] = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            record = json.loads(line)
            for v in record.get("araclar", []):
                if kapi_no and v.get("kapino") != kapi_no:
                    continue
                vehicle_history.append({
                    "ts": record["ts"],
                    "kapino": v.get("kapino"),
                    "enlem": v.get("enlem"),
                    "boylam": v.get("boylam"),
                    "yon": v.get("yon"),
                    "hatkodu": v.get("hatkodu"),
                    "yakinDurakKodu": v.get("yakinDurakKodu"),
                })
    return JSONResponse(vehicle_history)
