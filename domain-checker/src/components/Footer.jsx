import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <i className="fas fa-globe"></i>
              <span>DomainCheck</span>
            </div>
            <p>Hayalinizdeki domain adını bulmanın en kolay yolu. Ücretsiz sorgulama, uygun fiyatlar.</p>
            <div className="social-links">
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>
          <div className="footer-links">
            <h4>Hizmetler</h4>
            <a href="#">Domain Kaydı</a>
            <a href="#">Web Hosting</a>
            <a href="#">VPS Sunucu</a>
            <a href="#">SSL Sertifikası</a>
            <a href="#">E-posta Hosting</a>
          </div>
          <div className="footer-links">
            <h4>Destek</h4>
            <a href="#">Yardım Merkezi</a>
            <a href="#">Bilgi Bankası</a>
            <a href="#">Canlı Destek</a>
            <a href="#">İletişim</a>
          </div>
          <div className="footer-links">
            <h4>Şirket</h4>
            <a href="#">Hakkımızda</a>
            <a href="#">Gizlilik Politikası</a>
            <a href="#">Kullanım Şartları</a>
            <a href="#">Blog</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 DomainCheck. Tüm hakları saklıdır.</p>
          <div className="payment-methods">
            <i className="fab fa-cc-visa"></i>
            <i className="fab fa-cc-mastercard"></i>
            <i className="fab fa-cc-paypal"></i>
            <i className="fab fa-cc-stripe"></i>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
