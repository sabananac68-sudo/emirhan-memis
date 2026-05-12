# İETT Araç Takip Sistemi 🚌

İstanbul Toplu Taşıma araçlarının canlı konumlarını harita üzerinde takip eden web uygulaması.

## Özellikler

- **Canlı Araç Takibi**: Otobüslerin anlık konumlarını haritada görün
- **Hat Arama**: Hat koduna göre arama yapın (örn: 500T, 34G)
- **Durak Bilgileri**: Tüm durakları koordinatlarıyla birlikte görün
- **Güzergah Gösterimi**: Gidiş-dönüş güzergahlarını haritada izleyin
- **Otomatik Güncelleme**: Araç konumları 30 saniyede bir güncellenir
- **Duyurular**: İETT duyurularını takip edin
- **Popüler Hatlar**: En çok kullanılan hatları hızla görüntüleyin
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu

## Kullanılan API'ler

- [HatDurakGuzergah](https://api.ibb.gov.tr/iett/UlasimAnaVeri/HatDurakGuzergah.asmx?wsdl) - Hat, Durak ve Güzergah bilgileri
- [Duyurular](https://api.ibb.gov.tr/iett/UlasimDinamikVeri/Duyurular.asmx?wsdl) - Duyuru bilgileri
- [SeferGerceklesme](https://api.ibb.gov.tr/iett/FiloDurum/SeferGerceklesme.asmx?wsdl) - Filo durumu ve araç konumları
- [IBB](https://api.ibb.gov.tr/iett/ibb/ibb.asmx?wsdl) - Durak detay bilgileri
- [PlanlananSeferSaati](https://api.ibb.gov.tr/iett/UlasimAnaVeri/PlanlananSeferSaati.asmx?wsdl) - Planlı sefer saatleri

## Teknolojiler

- **Backend**: Python FastAPI
- **Frontend**: HTML5, CSS3, JavaScript
- **Harita**: Leaflet.js + OpenStreetMap
- **HTTP Client**: httpx (async SOAP/XML çağrıları)

## Kurulum

```bash
pip install fastapi uvicorn httpx
uvicorn app:app --host 0.0.0.0 --port 8000
```

Tarayıcıda `http://localhost:8000` adresine gidin.

## Ekran Görüntüsü

Uygulama İstanbul haritası üzerinde otobüslerin canlı konumlarını, durakları ve güzergahları gösterir.
