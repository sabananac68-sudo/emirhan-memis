import './Extensions.css';

const DOMAIN_EXTENSIONS = [
  { ext: '.com', price: '₺149.99', desc: 'En popüler uzantı', icon: 'fa-globe', color: '#673de6' },
  { ext: '.net', price: '₺129.99', desc: 'Teknoloji & ağ', icon: 'fa-network-wired', color: '#0ea5e9' },
  { ext: '.org', price: '₺119.99', desc: 'Kuruluşlar için', icon: 'fa-building-columns', color: '#22c55e' },
  { ext: '.io', price: '₺399.99', desc: 'Startuplar için', icon: 'fa-rocket', color: '#f97316' },
  { ext: '.dev', price: '₺149.99', desc: 'Geliştiriciler için', icon: 'fa-code', color: '#8b5cf6' },
  { ext: '.app', price: '₺149.99', desc: 'Uygulamalar için', icon: 'fa-mobile-screen', color: '#ec4899' },
  { ext: '.tr', price: '₺59.99', desc: 'Türkiye uzantısı', icon: 'fa-flag', color: '#ef4444' },
  { ext: '.com.tr', price: '₺89.99', desc: 'Türk şirketleri', icon: 'fa-building', color: '#14b8a6' },
  { ext: '.xyz', price: '₺29.99', desc: 'Yeni nesil', icon: 'fa-star', color: '#f59e0b' },
  { ext: '.online', price: '₺9.99', desc: 'Online varlık', icon: 'fa-wifi', color: '#06b6d4' },
  { ext: '.store', price: '₺49.99', desc: 'E-ticaret', icon: 'fa-store', color: '#a855f7' },
  { ext: '.tech', price: '₺49.99', desc: 'Teknoloji', icon: 'fa-microchip', color: '#3b82f6' },
];

function Extensions({ onSearch }) {
  return (
    <section className="extensions-section" id="extensions">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Uzantılar</span>
          <h2>Popüler Domain Uzantıları</h2>
          <p>İşletmenize en uygun domain uzantısını seçin</p>
        </div>
        <div className="extensions-grid">
          {DOMAIN_EXTENSIONS.map((item, index) => (
            <div
              key={item.ext}
              className="extension-card fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => onSearch(`ornek${item.ext}`)}
            >
              <div className="ext-icon" style={{ background: `${item.color}15`, color: item.color }}>
                <i className={`fas ${item.icon}`}></i>
              </div>
              <div className="ext-info">
                <h3>{item.ext}</h3>
                <p>{item.desc}</p>
              </div>
              <div className="ext-price">
                <span className="ext-amount">{item.price}</span>
                <span className="ext-period">/yıl</span>
              </div>
              <i className="fas fa-chevron-right ext-arrow"></i>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Extensions;
