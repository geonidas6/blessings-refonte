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

