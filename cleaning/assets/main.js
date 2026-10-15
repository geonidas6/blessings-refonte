const menuButton = document.querySelector('.menu');
const navigation = document.querySelector('.navlinks');
menuButton?.addEventListener('click', () => {
 const isOpen = menuButton.getAttribute('aria-expanded') !== 'true';
 menuButton.setAttribute('aria-expanded', String(isOpen));
 menuButton.textContent = isOpen ? 'Fermer ×' : 'Menu ☰';
 navigation.classList.toggle('open', isOpen);
});
document.addEventListener('keydown', event => {
 if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
  menuButton.click();
  menuButton.focus();
 }
});
document.querySelectorAll('[data-filter]').forEach(button => {
 button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelectorAll('[data-category]').forEach(card => {
   card.hidden = button.dataset.filter !== 'all' && button.dataset.filter !== card.dataset.category;
  });
 });
});
const form = document.querySelector('.form');
form?.addEventListener('submit', event => {
 event.preventDefault();
 if (!form.reportValidity()) return;
 const data = new FormData(form);
 const fields = [...new Set([...data.keys()])].filter(key => key !== 'Accord');
 const message = form.dataset.title + '\n\n' + fields.map(key => key + ' : ' + data.getAll(key).join(', ')).join('\n');
 const link = document.querySelector('.send-link');
 link.href = 'https://wa.me/32496973174?text=' + encodeURIComponent(message);
 link.hidden = false;
 const status = document.querySelector('.form-status');
 status.textContent = 'Votre message est prêt. Ouvrez WhatsApp ci-dessous, puis confirmez son envoi dans la conversation. Aucune demande n’a encore été envoyée.';
 link.focus();
});
const requestedService = new URLSearchParams(location.search).get('service');
const serviceSelect = document.querySelector('[name="Service"]');
if (requestedService && serviceSelect && [...serviceSelect.options].some(option => option.value === requestedService)) serviceSelect.value = requestedService;
const carousel = document.querySelector('.carousel');
if (carousel) {
 const slides = [...carousel.querySelectorAll('.slide')];
 const dots = [...carousel.querySelectorAll('.slider-dot')];
 const pauseButton = carousel.querySelector('.slider-pause');
 const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
 let activeIndex = 0;
 let paused = reducedMotion.matches;
 let timer;
 const showSlide = (index, announce = false) => {
  activeIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, position) => {
   const active = position === activeIndex;
   slide.classList.toggle('is-active', active);
   slide.inert = !active;
   slide.setAttribute('aria-hidden', String(!active));
   dots[position].setAttribute('aria-pressed', String(active));
  });
  if (announce) carousel.querySelector('.slide-status').textContent = 'Diapositive ' + (activeIndex + 1) + ' sur ' + slides.length;
 };
 const updatePause = () => {
  pauseButton.setAttribute('aria-pressed', String(paused));
  pauseButton.setAttribute('aria-label', paused ? 'Reprendre le défilement' : 'Mettre le défilement en pause');
  pauseButton.textContent = paused ? 'Lecture ▷' : 'Pause Ⅱ';
 };
 const stop = () => clearInterval(timer);
 const start = () => {
  stop();
  if (!paused && !document.hidden && !carousel.matches(':hover') && !carousel.contains(document.activeElement)) timer = setInterval(() => showSlide(activeIndex + 1), 6500);
 };
 const manual = index => { showSlide(index, true); paused = true; updatePause(); stop(); };
 carousel.querySelector('.slider-next').addEventListener('click', () => manual(activeIndex + 1));
 carousel.querySelector('.slider-prev').addEventListener('click', () => manual(activeIndex - 1));
 dots.forEach((dot,index) => dot.addEventListener('click', () => manual(index)));
 pauseButton.addEventListener('click', () => { paused = !paused; updatePause(); start(); });
 carousel.addEventListener('mouseenter', stop);
 carousel.addEventListener('mouseleave', start);
 carousel.addEventListener('focusin', stop);
 carousel.addEventListener('focusout', () => setTimeout(start, 0));
 document.addEventListener('visibilitychange', start);
 reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; updatePause(); start(); });
 let touchStart;
 carousel.addEventListener('touchstart', event => { touchStart = event.changedTouches[0].clientX; }, {passive:true});
 carousel.addEventListener('touchend', event => {
  if (touchStart === undefined) return;
  const distance = event.changedTouches[0].clientX - touchStart;
  if (Math.abs(distance) > 65) manual(activeIndex + (distance < 0 ? 1 : -1));
  touchStart = undefined;
 }, {passive:true});
 updatePause();
 start();
}
