---
name: testing-iett-tracking
description: Test the IETT vehicle tracking app end-to-end. Use when verifying map UI, archive system, vehicle tracking, or security fixes.
---

# Testing IETT Araç Takip Sistemi

## Prerequisites
- Python 3.12+ with FastAPI, uvicorn, httpx installed
- App located at `/home/ubuntu/emirhan-memis/`

## Starting the App
```bash
cd /home/ubuntu/emirhan-memis
pkill -f 'uvicorn' 2>/dev/null; sleep 1
nohup uvicorn app:app --host 0.0.0.0 --port 8000 > /tmp/server.log 2>&1 &
```
Wait ~2s, then verify: `curl -s http://localhost:8000/ | head -5`

To share with user: use `deploy expose --port 8000` to get a public URL.

## Key UI Elements
- **Sidebar tabs**: Hatlar, Araçlar, Duraklar, Duyurular, Arşiv
- **Detaylı Arama form**: Hat No, Kapı No, Tarih fields + "Araç Takip Et" button
- **Archive form**: Hat No, Tarih (date picker), Kapı No (optional) + "Arşiv Ara" button
- **Tracking banner**: Shows at top when vehicle tracking is active

## Testing the Archive System

### Archive Data
- Archive snapshots are saved to `archive/` directory as JSONL files
- Filename format: `{hat_kodu}_{YYYY-MM-DD}.jsonl`
- The background archiver runs every 60s, so fresh data needs time to accumulate
- For timeline playback testing, you need ≥2 records; check with `wc -l archive/*.jsonl`
- If today's data is insufficient, use a date that has more records

### Date Input Handling
- The archive date field is `<input type="date">` with ID `archiveTarih`
- Browser date inputs are tricky to set via GUI clicks; use Playwright CDP instead:
  ```python
  await page.evaluate("document.getElementById('archiveTarih').value = '2026-05-12'")
  ```
- Other archive field IDs: `archiveHat` (Hat No), `archiveKapi` (Kapı No)

### Archive Test Flow
1. Click Arşiv tab → Set date → Click "Arşiv Ara"
2. **All vehicles**: Expect "X kayıt bulundu", timeline slider, purple markers, vehicle list
3. **Single vehicle** (with Kapı No): Expect "X konum kaydı bulundu", route trail, NO timeline slider
4. **Timeline playback**: Move slider → time label changes; Click "Oynat" → button becomes "Durdur"

## Testing XSS Security

### escHtml Function
- Test via Playwright: `await page.evaluate("escHtml('<script>alert(1)</script>')")`
- Should return escaped entities (`&lt;`, `&gt;`) not raw angle brackets

### textContent vs innerHTML
- Enter `<b>test</b>` in Hat No field of Detaylı Arama form
- Click "Araç Takip Et"
- The tracking banner should show literal `<B>TEST</B>` as text, not bold HTML
- Detaylı Arama field IDs: `advHat`, `advKapi`, `advTarih`

## Common Issues
- **Server not starting**: Check if port 8000 is already in use (`lsof -i :8000`)
- **Archive empty**: Server needs to run ≥60s to collect first snapshot
- **Date picker not updating**: Use Playwright CDP `page.evaluate()` instead of GUI clicks
- **IETT API timeouts**: External API may be slow; check `/tmp/server.log` for errors

## Devin Secrets Needed
None — the app uses public IETT APIs with no authentication required.
