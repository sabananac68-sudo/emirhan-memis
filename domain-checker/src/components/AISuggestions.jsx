import { useState } from 'react';
import './AISuggestions.css';

const BUSINESS_CATEGORIES = [
  { id: 'tech', label: 'Teknoloji', icon: 'fas fa-laptop-code', keywords: ['tech', 'digital', 'soft', 'app', 'code', 'dev', 'byte', 'pixel', 'cyber', 'net'] },
  { id: 'ecommerce', label: 'E-Ticaret', icon: 'fas fa-shopping-bag', keywords: ['shop', 'store', 'market', 'trade', 'buy', 'cart', 'deal', 'outlet', 'bazaar', 'mall'] },
  { id: 'creative', label: 'Yaratıcı', icon: 'fas fa-palette', keywords: ['art', 'design', 'studio', 'creative', 'craft', 'media', 'visual', 'color', 'idea', 'ink'] },
  { id: 'education', label: 'Eğitim', icon: 'fas fa-graduation-cap', keywords: ['edu', 'learn', 'academy', 'school', 'course', 'skill', 'mentor', 'class', 'study', 'brain'] },
  { id: 'health', label: 'Sağlık', icon: 'fas fa-heartbeat', keywords: ['health', 'care', 'fit', 'vita', 'med', 'well', 'life', 'zen', 'pure', 'glow'] },
  { id: 'food', label: 'Yemek', icon: 'fas fa-utensils', keywords: ['food', 'taste', 'kitchen', 'chef', 'bite', 'fresh', 'flavor', 'feast', 'spice', 'yummy'] },
  { id: 'travel', label: 'Seyahat', icon: 'fas fa-plane', keywords: ['travel', 'trip', 'tour', 'voyage', 'roam', 'explore', 'wander', 'globe', 'nomad', 'atlas'] },
  { id: 'finance', label: 'Finans', icon: 'fas fa-chart-line', keywords: ['fin', 'pay', 'cash', 'fund', 'invest', 'money', 'wealth', 'capital', 'profit', 'bank'] },
];

const NAME_PATTERNS = [
  (word, keyword) => `${word}${keyword}`,
  (word, keyword) => `${keyword}${word}`,
  (word) => `get${word}`,
  (word) => `my${word}`,
  (word) => `the${word}`,
  (word) => `go${word}`,
  (word, keyword) => `${word}-${keyword}`,
  (word) => `${word}hub`,
  (word) => `${word}ify`,
  (word) => `${word}io`,
  (word) => `${word}lab`,
  (word) => `${word}pro`,
  (word) => `${word}now`,
  (word) => `${word}up`,
  (word) => `${word}zone`,
];

const SUGGESTED_EXTENSIONS = ['.com', '.net', '.io', '.dev', '.app', '.co', '.xyz', '.online', '.tech', '.store'];

function simulateAvailability(domain, ext) {
  const hash = (domain + ext).split('').reduce((a, c) => {
    return ((a << 5) - a + c.charCodeAt(0)) | 0;
  }, 0);
  return Math.abs(hash) % 3 !== 0;
}

function generateAISuggestions(brandName, categoryId) {
  const cleanName = brandName.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  if (!cleanName) return [];

  const category = BUSINESS_CATEGORIES.find(c => c.id === categoryId) || BUSINESS_CATEGORIES[0];
  const suggestions = new Set();

  suggestions.add(cleanName);

  for (const keyword of category.keywords) {
    for (const pattern of NAME_PATTERNS) {
      const name = pattern(cleanName, keyword);
      if (name.length >= 3 && name.length <= 20) {
        suggestions.add(name);
      }
    }
  }

  const results = [];
  for (const name of suggestions) {
    for (const ext of SUGGESTED_EXTENSIONS) {
      const available = simulateAvailability(name, ext);
      if (available) {
        results.push({
          domain: `${name}${ext}`,
          name,
          ext,
          available: true,
          score: calculateScore(name, cleanName, ext, category.id),
        });
      }
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 12);
}

function calculateScore(name, original, ext, categoryId) {
  let score = 50;

  if (name === original) score += 30;
  else if (name.startsWith(original)) score += 20;
  else if (name.includes(original)) score += 10;

  if (ext === '.com') score += 25;
  else if (ext === '.io' || ext === '.dev') score += 15;
  else if (ext === '.net' || ext === '.co') score += 10;

  if (name.length <= 10) score += 15;
  else if (name.length <= 15) score += 5;

  if (!name.includes('-')) score += 5;

  if (categoryId === 'tech' && (ext === '.io' || ext === '.dev' || ext === '.tech')) score += 10;
  if (categoryId === 'ecommerce' && (ext === '.store' || ext === '.online')) score += 10;

  return score;
}

function AISuggestions({ onSearch }) {
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('tech');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!brandName.trim()) return;
    setLoading(true);
    setGenerated(false);
    setSuggestions([]);

    setTimeout(() => {
      const results = generateAISuggestions(brandName, category);
      setSuggestions(results);
      setLoading(false);
      setGenerated(true);
    }, 2000);
  };

  const handleSuggestionClick = (domain) => {
    const name = domain.split('.')[0];
    onSearch(name);
  };

  return (
    <section className="ai-section" id="ai">
      <div className="container">
        <div className="ai-badge">
          <i className="fas fa-robot"></i>
          Yapay Zeka Destekli
        </div>
        <h2 className="ai-title">
          AI ile <span className="gradient-text">Domain</span> Önerisi
        </h2>
        <p className="ai-subtitle">
          Marka adınızı ve sektörünüzü seçin, yapay zeka sizin için en uygun
          domain isimlerini önersin.
        </p>

        <div className="ai-form">
          <div className="ai-input-group">
            <div className="ai-input-wrapper">
              <i className="fas fa-lightbulb ai-input-icon"></i>
              <input
                type="text"
                className="ai-input"
                placeholder="Marka veya proje adınız... (örn: techvizyon)"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>
          </div>

          <div className="ai-categories">
            <p className="categories-label">
              <i className="fas fa-layer-group"></i>
              Sektör Seçin:
            </p>
            <div className="categories-grid">
              {BUSINESS_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-btn ${category === cat.id ? 'active' : ''}`}
                  onClick={() => setCategory(cat.id)}
                >
                  <i className={cat.icon}></i>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            className="ai-generate-btn"
            onClick={handleGenerate}
            disabled={!brandName.trim() || loading}
          >
            {loading ? (
              <>
                <div className="ai-spinner"></div>
                <span>AI Düşünüyor...</span>
              </>
            ) : (
              <>
                <i className="fas fa-magic"></i>
                <span>Domain Önerisi Al</span>
              </>
            )}
          </button>
        </div>

        {loading && (
          <div className="ai-loading">
            <div className="ai-loading-animation">
              <div className="ai-pulse-ring"></div>
              <div className="ai-pulse-ring delay-1"></div>
              <div className="ai-pulse-ring delay-2"></div>
              <i className="fas fa-brain ai-brain-icon"></i>
            </div>
            <p className="ai-loading-text">Yapay zeka en uygun domain isimlerini arıyor...</p>
            <div className="ai-loading-steps">
              <span className="step active">Analiz ediliyor</span>
              <span className="step-arrow">→</span>
              <span className="step">Öneriler oluşturuluyor</span>
              <span className="step-arrow">→</span>
              <span className="step">Müsaitlik kontrol ediliyor</span>
            </div>
          </div>
        )}

        {generated && suggestions.length > 0 && (
          <div className="ai-results fade-in">
            <div className="ai-results-header">
              <h3>
                <i className="fas fa-sparkles"></i>
                AI Önerileri
              </h3>
              <span className="ai-results-count">{suggestions.length} öneri bulundu</span>
            </div>
            <div className="ai-results-grid">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.domain}
                  className="ai-suggestion-card fade-in"
                  style={{ animationDelay: `${index * 0.08}s` }}
                  onClick={() => handleSuggestionClick(suggestion.domain)}
                >
                  <div className="suggestion-top">
                    <span className="suggestion-domain">{suggestion.domain}</span>
                    {suggestion.score >= 90 && (
                      <span className="ai-top-pick">
                        <i className="fas fa-crown"></i>
                        En İyi
                      </span>
                    )}
                    {suggestion.score >= 70 && suggestion.score < 90 && (
                      <span className="ai-recommended">
                        <i className="fas fa-thumbs-up"></i>
                        Önerilen
                      </span>
                    )}
                  </div>
                  <div className="suggestion-bottom">
                    <span className="suggestion-status">
                      <i className="fas fa-check-circle"></i>
                      Müsait
                    </span>
                    <span className="suggestion-action">
                      Sorgula <i className="fas fa-arrow-right"></i>
                    </span>
                  </div>
                  <div className="ai-score-bar">
                    <div
                      className="ai-score-fill"
                      style={{ width: `${Math.min(suggestion.score, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {generated && suggestions.length === 0 && (
          <div className="ai-no-results fade-in">
            <i className="fas fa-search"></i>
            <p>Bu isim için uygun öneri bulunamadı. Farklı bir isim deneyin.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default AISuggestions;
