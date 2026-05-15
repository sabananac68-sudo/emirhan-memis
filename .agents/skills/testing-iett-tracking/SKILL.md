---
name: testing-iett-tracking
description: Test the IETT Araç Takip Sistemi app end-to-end. Use when verifying vehicle tracking UI, archive/history features, or API changes.
---

# Testing IETT Araç Takip Sistemi

## Prerequisites

- Python 3 with FastAPI, uvicorn, httpx installed
- Archive JSONL files in `archive/` directory (e.g. `86V_2026-05-12.jsonl`)

## Starting the App

```bash
cd /home/ubuntu/emirhan-memis
uvicorn app:app --host 0.0.0.0 --port 8000 &
```

App runs at `http://localhost:8000`. No authentication required.

## Key Test Areas

### 1. Default Load
- On page load, 86V route auto-loads with live vehicle positions
- Banner shows "Hat: 86V | Tarih: 28.04.2026 20:00"
- Kapı No field in Detaylı Arama is empty (all vehicles shown)
- Status bar shows vehicle count, stop count, route info

### 2. Geçmiş (History) Tab
- Click "Geçmiş" tab in sidebar
- Default values: Hat No = `86V`, Tarih = `28.04.2026`, Kapı No = `A-244`
- Title: "Geçmiş Araç Konumu"
- Date input is text field with `GG.AA.YYYY` placeholder (NOT a date picker)
- Button text: "Geçmiş Konum Ara"

### 3. Turkish Date Parser
- The Tarih field accepts Turkish format dates like `15.05.2026`
- `parseTurkishDate()` converts GG.AA.YYYY → YYYY-MM-DD for API queries
- To test: enter a Turkish date matching an existing archive file
- Check archive files: `ls archive/` to see available dates

### 4. Archive Timeline Playback (no Kapı No)
- Clear Kapı No, set Hat and Tarih, click search
- Should show "X kayıt bulundu" with timeline slider
- Oynat/Durdur buttons for playback
- Vehicle markers appear on map

### 5. Vehicle-Specific History (with Kapı No)
- Set specific Kapı No (e.g. `A-234`), click search
- Should show "X konum kaydı bulundu"
- Purple circle markers + dashed route line on map
- Vehicle positions listed with timestamps and stop names

## Known Issues

- Clearing input fields via keyboard shortcuts might not work reliably in browser automation. Use Playwright `page.fill('#archiveKapi', '')` instead.
- Archive data only exists for dates when the archiver was running. Check `archive/` directory for available dates before testing.
- The otobus34.com.tr reference site is protected by Cloudflare and may not be directly accessible.

## Useful API Endpoints for Debugging

- `GET /api/hat?kod=86V` — search routes
- `GET /api/arac?hat=86V` — live vehicle positions
- `GET /api/arsiv?hat_kodu=86V&tarih=2026-05-15` — archive timeline (note: API uses YYYY-MM-DD)
- `GET /api/arsiv/arac?hat_kodu=86V&tarih=2026-05-12&kapi_no=A-234` — vehicle-specific history
- `GET /api/arsiv/tarihler?hat_kodu=86V` — list available archive dates
