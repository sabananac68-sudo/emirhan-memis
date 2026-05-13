import { useState, useEffect, useRef } from 'react';
import './Results.css';

const EXTENSIONS = [
  { ext: '.com', price: '₺149.99', originalPrice: '₺249.99', popular: true },
  { ext: '.net', price: '₺129.99', originalPrice: '₺199.99', popular: false },
  { ext: '.org', price: '₺119.99', originalPrice: '₺189.99', popular: false },
  { ext: '.io', price: '₺399.99', originalPrice: '₺599.99', popular: true },
  { ext: '.dev', price: '₺149.99', originalPrice: '₺249.99', popular: false },
  { ext: '.app', price: '₺149.99', originalPrice: '₺249.99', popular: false },
  { ext: '.co', price: '₺249.99', originalPrice: '₺399.99', popular: false },
  { ext: '.me', price: '₺179.99', originalPrice: '₺299.99', popular: false },
  { ext: '.xyz', price: '₺29.99', originalPrice: '₺99.99', popular: false },
  { ext: '.online', price: '₺9.99', originalPrice: '₺49.99', popular: false },
  { ext: '.store', price: '₺49.99', originalPrice: '₺149.99', popular: false },
  { ext: '.site', price: '₺9.99', originalPrice: '₺49.99', popular: false },
  { ext: '.tech', price: '₺49.99', originalPrice: '₺149.99', popular: false },
  { ext: '.info', price: '₺79.99', originalPrice: '₺129.99', popular: false },
  { ext: '.tr', price: '₺59.99', originalPrice: '₺99.99', popular: true },
  { ext: '.com.tr', price: '₺89.99', originalPrice: '₺149.99', popular: true },
];

function cleanDomainInput(input) {
  let domain = input.toLowerCase().trim();
  domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
  const dotIndex = domain.indexOf('.');
  if (dotIndex !== -1) {
    domain = domain.substring(0, dotIndex);
  }
  domain = domain.replace(/[^a-z0-9-]/g, '');
  return domain;
}

function simulateAvailability(domain, ext) {
  const hash = (domain + ext).split('').reduce((a, c) => {
    return ((a << 5) - a + c.charCodeAt(0)) | 0;
  }, 0);
  return Math.abs(hash) % 3 !== 0;
}

function Results({ searchQuery, onNewSearch }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [domainName, setDomainName] = useState('');
  const prevQueryRef = useRef('');

  useEffect(() => {
    if (!searchQuery || searchQuery === prevQueryRef.current) return;
    prevQueryRef.current = searchQuery;

    const cleaned = cleanDomainInput(searchQuery);

    const timer = setTimeout(() => {
      const generated = EXTENSIONS.map((item) => ({
        ...item,
        domain: cleaned + item.ext,
        available: simulateAvailability(cleaned, item.ext),
      }));
      setResults(generated);
      setDomainName(cleaned);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const isLoading = searchQuery && (loading || domainName !== cleanDomainInput(searchQuery));

  if (!searchQuery) return null;

  return (
    <section className="results-section" id="results">
      <div className="container">
        <div className="results-header">
          <h2>
            <span className="results-query">&ldquo;{domainName || cleanDomainInput(searchQuery)}&rdquo;</span> için sonuçlar
          </h2>
          <button className="new-search-btn" onClick={onNewSearch}>
            <i className="fas fa-search"></i>
            Yeni Arama
          </button>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Domain müsaitliği kontrol ediliyor...</p>
            <div className="loading-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        ) : (
          <>
            <div className="main-result fade-in">
              {results[0]?.available ? (
                <div className="main-result-card available">
                  <div className="result-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="result-info">
                    <h3>{results[0].domain}</h3>
                    <p>Bu domain müsait! Hemen satın alabilirsiniz.</p>
                  </div>
                  <div className="result-price">
                    <span className="original-price">{results[0].originalPrice}</span>
                    <span className="current-price">{results[0].price}</span>
                    <span className="price-period">/yıl</span>
                  </div>
                  <button className="add-to-cart-btn">
                    <i className="fas fa-shopping-cart"></i>
                    Sepete Ekle
                  </button>
                </div>
              ) : (
                <div className="main-result-card taken">
                  <div className="result-icon">
                    <i className="fas fa-times-circle"></i>
                  </div>
                  <div className="result-info">
                    <h3>{results[0].domain}</h3>
                    <p>Bu domain zaten alınmış. Alternatiflere göz atın!</p>
                  </div>
                </div>
              )}
            </div>

            <h3 className="alternatives-title">
              <i className="fas fa-th-list"></i>
              Tüm Uzantılar
            </h3>
            <div className="results-grid">
              {results.map((result, index) => (
                <ResultCard key={result.ext} result={result} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ResultCard({ result, index }) {
  return (
    <div
      className={`result-card fade-in ${result.available ? 'available' : 'taken'}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="card-top">
        <div className="card-domain">
          <span className="domain-name">{result.domain}</span>
          {result.popular && <span className="popular-badge">Popüler</span>}
        </div>
        <div className={`status-badge ${result.available ? 'status-available' : 'status-taken'}`}>
          <i className={`fas ${result.available ? 'fa-check' : 'fa-lock'}`}></i>
          {result.available ? 'Müsait' : 'Alınmış'}
        </div>
      </div>
      {result.available ? (
        <div className="card-bottom">
          <div className="card-pricing">
            <span className="card-original">{result.originalPrice}</span>
            <span className="card-price">{result.price}<small>/yıl</small></span>
          </div>
          <button className="card-btn">
            <i className="fas fa-plus"></i>
            Ekle
          </button>
        </div>
      ) : (
        <div className="card-bottom taken-bottom">
          <span className="taken-text">Bu domain kullanımda</span>
          <button className="whois-btn">
            <i className="fas fa-info-circle"></i>
            WHOIS
          </button>
        </div>
      )}
    </div>
  );
}

export default Results;
