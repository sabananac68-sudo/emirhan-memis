---
name: testing-iett-tracking
description: Test the IETT vehicle tracking app end-to-end. Use when verifying map UI, vehicle tracking, route search, or API proxy changes.
---

# Testing IETT Vehicle Tracking App

## Prerequisites
- Python 3.11+ with FastAPI, uvicorn, httpx installed
- No authentication needed (IETT APIs are public)
- No database required

## Start the Server
```bash
cd /home/ubuntu/emirhan-memis
uvicorn app:app --host 0.0.0.0 --port 8000
```

## Key Test Flows

### 1. Auto-load Default Route
- Navigate to http://localhost:8000
- App auto-loads route 86V with A-244 tracking
- Verify: orange tracking banner, vehicle list, stops on map, route info overlay

### 2. Route Search
- Type a route code (e.g. "500T", "34G") in search box and click "Ara"
- Verify: route info overlay updates, vehicle markers appear on map, vehicle list updates
- Popular routes: 500T, 34G, 34AS, 34BZ, 34Z, 76D, 34C, 29C

### 3. Advanced Vehicle Search (Detayli Arama)
- Fill in Hat No, Kapi No, Tarih fields
- Click "Arac Takip Et"
- If vehicle is active: orange icon on map (42px, larger), popup auto-opens with "TAKIP EDILIYOR" badge, vehicle sorted to top of list with "TAKIP" badge
- If vehicle not active: status shows "su an hatta aktif degil - Bekleniyor..."

### 4. Direction Filtering
- Click "Duraklar" tab
- Use Gidis/Donus filter buttons
- Verify: stops list changes based on direction, all visible stops match selected direction

### 5. Announcements
- Click "Duyurular" tab
- Verify: announcements load with route code badges and message text

## API Endpoints (Backend)
- `GET /api/hat?kod=86V` — Route info
- `GET /api/arac-konum?hat_kodu=86V` — Live vehicle positions
- `GET /api/durak-detay?hat_kodu=86V` — Stop details with coordinates
- `GET /api/duyurular` — IETT announcements
- `GET /api/filo-konum` — All fleet positions

## Known Behaviors
- IETT APIs are rate-limited; avoid rapid repeated calls
- Vehicle positions update every 30 seconds via auto-refresh
- Some vehicles may not be active at all times (especially late night)
- The AracOzellik API requires authentication and is not used
- Route line colors: blue solid = Gidis (outbound), red dashed = Donus (return)

## Devin Secrets Needed
None — all IETT APIs are public and require no authentication.
