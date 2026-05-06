import { EVENT_END, getCountdownParts } from './countdown.js';

const { createElement: h, useEffect, useMemo, useState } = React;
const { createRoot } = ReactDOM;

const launches = [
  {
    name: 'Gemini 3.5',
    eyebrow: 'AI model sahnesi',
    description:
      'Akıl yürütme, kodlama ve üretken yapay zekâ demoları için neon bir lansman kartı.',
    resolution: 'Ultra context • multimodal',
    gradient: 'blue',
  },
  {
    name: 'Veo 4',
    eyebrow: 'Video üretimi',
    description:
      'Sinematik video, hareket, ses ve storyboard akışları için büyük ekran odağı.',
    resolution: '4K ready • 16:9 / 9:16',
    gradient: 'red',
  },
  {
    name: 'Nano Banana 3.5',
    eyebrow: 'Nano deneyler',
    description:
      'Hızlı, hafif ve eğlenceli tarayıcı deneyleri için sarı vurgu temalı bekleme alanı.',
    resolution: 'Fast mode • mobile first',
    gradient: 'yellow',
  },
];

function CountdownTile({ label, value }) {
  return h(
    'div',
    { className: 'countdown-tile', 'aria-label': `${value} ${label}` },
    h('strong', null, String(value).padStart(2, '0')),
    h('span', null, label),
  );
}

function LaunchCard({ launch }) {
  return h(
    'article',
    { className: `launch-card ${launch.gradient}` },
    h('p', null, launch.eyebrow),
    h('div', null, h('h3', null, launch.name), h('span', null, launch.resolution)),
    h('p', { className: 'card-copy' }, launch.description),
  );
}

function App() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const countdown = useMemo(() => getCountdownParts(now), [now]);
  const eventEnded = now > EVENT_END;
  const statusText = eventEnded
    ? 'Google I/O 2026 tamamlandı'
    : countdown.live
      ? 'Google I/O 2026 yayında!'
      : 'Google I/O 2026 için geri sayım';

  return h(
    'main',
    { className: 'app-shell' },
    h(
      'section',
      { className: 'hero' },
      h(
        'div',
        { className: 'hero-copy' },
        h('div', { className: 'pill' }, '19–20 Mayıs 2026 • Mountain View + Online'),
        h('h1', null, 'Google I/O 2026 Countdown'),
        h(
          'p',
          null,
          'Gemini 3.5, Veo 4 ve Nano Banana 3.5 başlıklarını tek bir modern web tarayıcı arayüzünde takip etmek için React ile hazırlanmış canlı sayaç.',
        ),
      ),
      h(
        'div',
        { className: 'browser-frame', role: 'img', 'aria-label': 'Google I/O countdown browser preview' },
        h(
          'div',
          { className: 'browser-topbar' },
          h('span'),
          h('span'),
          h('span'),
          h('div', null, 'io.google/2026'),
        ),
        h(
          'div',
          { className: 'browser-content' },
          h('p', { className: 'status' }, statusText),
          h(
            'div',
            { className: 'countdown-grid' },
            h(CountdownTile, { label: 'Gün', value: countdown.days }),
            h(CountdownTile, { label: 'Saat', value: countdown.hours }),
            h(CountdownTile, { label: 'Dakika', value: countdown.minutes }),
            h(CountdownTile, { label: 'Saniye', value: countdown.seconds }),
          ),
          h(
            'div',
            { className: 'event-window' },
            h('span', null, 'Başlangıç'),
            h('strong', null, '19 Mayıs 2026, 10:00 PT'),
            h('span', null, 'Bitiş'),
            h('strong', null, '20 Mayıs 2026, 18:00 PT'),
          ),
        ),
      ),
    ),
    h(
      'section',
      { className: 'launch-grid', 'aria-label': 'Beklenen duyuru kartları' },
      ...launches.map((launch) => h(LaunchCard, { key: launch.name, launch })),
    ),
  );
}

createRoot(document.getElementById('root')).render(h(App));
