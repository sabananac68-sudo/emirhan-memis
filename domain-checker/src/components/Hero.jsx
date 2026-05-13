import './Hero.css';

function Hero({ onSearch }) {
  return (
    <section className="hero" id="search">
      <div className="hero-bg">
        <div className="hero-shape hero-shape-1"></div>
        <div className="hero-shape hero-shape-2"></div>
        <div className="hero-shape hero-shape-3"></div>
      </div>
      <div className="hero-content">
        <div className="hero-badge">
          <i className="fas fa-sparkles"></i>
          Ücretsiz Domain Sorgulama
        </div>
        <h1 className="hero-title">
          Hayalindeki <span className="gradient-text">Domain</span> Adını Bul
        </h1>
        <p className="hero-subtitle">
          Binlerce domain uzantısı arasından arama yapın. Anında müsaitlik kontrolü ile
          işletmeniz için mükemmel alan adını bulun.
        </p>
        <SearchBar onSearch={onSearch} />
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">500+</span>
            <span className="stat-label">Domain Uzantısı</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-number">%99.9</span>
            <span className="stat-label">Uptime Garantisi</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-number">7/24</span>
            <span className="stat-label">Destek</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchBar({ onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const domain = formData.get('domain').trim();
    if (domain) {
      onSearch(domain);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <i className="fas fa-search search-icon"></i>
        <input
          type="text"
          name="domain"
          placeholder="Domain adınızı yazın... (örn: isminiz.com)"
          className="search-input"
          autoComplete="off"
        />
      </div>
      <button type="submit" className="search-btn">
        <span>Sorgula</span>
        <i className="fas fa-arrow-right"></i>
      </button>
    </form>
  );
}

export default Hero;
