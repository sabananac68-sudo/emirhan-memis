import './Pricing.css';

const PLANS = [
  {
    name: 'Başlangıç',
    price: '₺29.99',
    period: '/ay',
    features: [
      '1 Domain',
      '10 GB SSD Disk',
      'Ücretsiz SSL',
      '1 E-posta Hesabı',
      'Haftalık Yedekleme',
    ],
    highlighted: false,
    icon: 'fa-seedling',
  },
  {
    name: 'Profesyonel',
    price: '₺59.99',
    period: '/ay',
    features: [
      'Sınırsız Domain',
      '100 GB SSD Disk',
      'Ücretsiz SSL',
      'Sınırsız E-posta',
      'Günlük Yedekleme',
      'SSH Erişimi',
      'Ücretsiz CDN',
    ],
    highlighted: true,
    badge: 'En Popüler',
    icon: 'fa-rocket',
  },
  {
    name: 'Kurumsal',
    price: '₺99.99',
    period: '/ay',
    features: [
      'Sınırsız Domain',
      '200 GB NVMe Disk',
      'Ücretsiz SSL (Wildcard)',
      'Sınırsız E-posta',
      'Saatlik Yedekleme',
      'SSH Erişimi',
      'Ücretsiz CDN',
      'Öncelikli Destek',
      'Staging Ortamı',
    ],
    highlighted: false,
    icon: 'fa-building',
  },
];

function Pricing() {
  return (
    <section className="pricing-section" id="pricing">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Fiyatlandırma</span>
          <h2>Hosting Planları</h2>
          <p>Domain ile birlikte hosting planı seçin, hemen yayına başlayın</p>
        </div>
        <div className="pricing-grid">
          {PLANS.map((plan, index) => (
            <div
              key={plan.name}
              className={`pricing-card fade-in ${plan.highlighted ? 'highlighted' : ''}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {plan.badge && <div className="pricing-badge">{plan.badge}</div>}
              <div className="pricing-icon">
                <i className={`fas ${plan.icon}`}></i>
              </div>
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                <span className="price-amount">{plan.price}</span>
                <span className="price-period">{plan.period}</span>
              </div>
              <ul className="plan-features">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <i className="fas fa-check"></i>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`plan-btn ${plan.highlighted ? 'plan-btn-primary' : ''}`}>
                Planı Seç
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pricing;
