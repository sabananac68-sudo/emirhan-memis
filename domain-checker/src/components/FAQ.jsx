import { useState } from 'react';
import './FAQ.css';

const FAQ_DATA = [
  {
    question: 'Domain adı nedir?',
    answer: 'Domain adı, web sitenizin internetteki adresidir. Kullanıcılar tarayıcılarına domain adınızı yazarak web sitenize erişirler. Örneğin: google.com, youtube.com gibi.',
  },
  {
    question: 'Domain sorgulama nasıl yapılır?',
    answer: 'Üst kısımdaki arama çubuğuna istediğiniz domain adını yazarak sorgulama yapabilirsiniz. Sistem otomatik olarak tüm popüler uzantılarda (.com, .net, .org, .tr vb.) müsaitlik kontrolü yapar.',
  },
  {
    question: 'Hangi domain uzantısını seçmeliyim?',
    answer: '.com en yaygın ve güvenilir uzantıdır. Türkiye\'de faaliyet gösteriyorsanız .com.tr veya .tr tercih edebilirsiniz. Teknoloji şirketleri için .io ve .dev popülerdir. E-ticaret için .store kullanabilirsiniz.',
  },
  {
    question: 'Domain ne kadar süreyle alınır?',
    answer: 'Domain adları genellikle 1 yıllık sürelerle kaydedilir. İsterseniz 2, 3, 5 veya 10 yıllık paketler de tercih edebilirsiniz. Süre bitiminde yenileme yaparak domain adınızı koruyabilirsiniz.',
  },
  {
    question: 'Ücretsiz SSL sertifikası dahil mi?',
    answer: 'Evet! Tüm domain ve hosting paketlerimizde ücretsiz SSL sertifikası (Let\'s Encrypt) dahildir. SSL sertifikası web sitenizin HTTPS protokolü ile güvenli bir şekilde çalışmasını sağlar.',
  },
  {
    question: 'Domain transferi yapabilir miyim?',
    answer: 'Evet, başka bir sağlayıcıdan aldığınız domain adını bize transfer edebilirsiniz. Transfer işlemi genellikle 5-7 iş günü sürer ve mevcut kayıt sürenize 1 yıl eklenir.',
  },
  {
    question: 'WHOIS gizliliği nedir?',
    answer: 'WHOIS, domain kayıt bilgilerinizin (ad, adres, e-posta vb.) herkese açık bir veritabanında görünmesidir. WHOIS gizliliği hizmeti ile kişisel bilgilerinizi gizleyebilir, spam ve dolandırıcılıktan korunabilirsiniz.',
  },
  {
    question: 'DNS yönetimi nasıl yapılır?',
    answer: 'Domain adınızı satın aldıktan sonra kontrol panelinizden DNS kayıtlarınızı (A, CNAME, MX, TXT vb.) yönetebilirsiniz. DNS değişiklikleri genellikle 24-48 saat içinde dünya genelinde yayılır.',
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">SSS</span>
          <h2>Sıkça Sorulan Sorular</h2>
          <p>Domain ve hosting hakkında merak ettikleriniz</p>
        </div>
        <div className="faq-grid">
          {FAQ_DATA.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
              onClick={() => toggle(index)}
            >
              <div className="faq-question">
                <span>{item.question}</span>
                <i className={`fas ${openIndex === index ? 'fa-minus' : 'fa-plus'}`}></i>
              </div>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
