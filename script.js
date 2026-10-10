// Mobile menu
const menuBtn = document.querySelector('.menu-btn');
const nav = document.getElementById('nav');
menuBtn?.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});
nav?.addEventListener('click', e => {
  if (e.target.closest('a')) { menuBtn.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }
});

// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

// Hero mark assembles when it comes into view
const markTile = document.querySelector('.tile-mark');
if (markTile) new IntersectionObserver((en, obs) => {
  if (en[0].isIntersecting) { markTile.classList.add('play'); obs.disconnect(); }
}, { threshold: 0.4 }).observe(markTile);

// Map facade: load Google Maps only on tap
document.querySelectorAll('.map-load').forEach(btn => btn.addEventListener('click', () => {
  const box = btn.closest('.map');
  const f = document.createElement('iframe');
  f.src = box.dataset.embed; f.title = 'Map of Sabang, Naic, Cavite'; f.loading = 'lazy';
  f.referrerPolicy = 'no-referrer-when-downgrade';
  f.style.cssText = 'width:100%;aspect-ratio:16/10;border:0;display:block';
  box.replaceChildren(f);
}));

// Form: show a note while the Formspree ID is still a placeholder (preview)
const form = document.querySelector('.form');
form?.addEventListener('submit', e => {
  if (form.action.includes('FORM_ID')) {
    e.preventDefault();
    form.querySelector('.form-note').textContent = 'Preview only: the form is not connected yet. Please message us on Messenger.';
  }
});

// Projects: filter buttons
const filterBtns = document.querySelectorAll('.filters button');
const tiles = [...document.querySelectorAll('.pgrid button')];
filterBtns.forEach(b => b.addEventListener('click', () => {
  const f = b.dataset.filter;
  filterBtns.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  tiles.forEach(t => { t.hidden = f !== 'all' && t.dataset.cat !== f; });
  const n = document.querySelector('.count span');
  if (n) n.textContent = tiles.filter(t => !t.hidden).length;
}));

// Projects: lightbox (native <dialog>, Esc closes)
const lb = document.querySelector('.lightbox');
if (lb) {
  const img = lb.querySelector('img'), cap = lb.querySelector('.lb-cap');
  let i = 0;
  const visible = () => tiles.filter(t => !t.hidden);
  const show = n => {
    const v = visible(); i = (n + v.length) % v.length;
    img.src = v[i].dataset.full; img.alt = v[i].dataset.cap; cap.textContent = v[i].dataset.cap;
  };
  tiles.forEach(t => t.addEventListener('click', () => { show(visible().indexOf(t)); lb.showModal(); }));
  lb.querySelector('.lb-close').addEventListener('click', () => lb.close());
  lb.querySelector('.lb-prev').addEventListener('click', () => show(i - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => show(i + 1));
  lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-inner')) lb.close(); });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1); });
}
