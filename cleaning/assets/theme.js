(() => {
 const storageKey = 'blessings-theme';
 let selected = 'current';
 try { selected = localStorage.getItem(storageKey) === 'logo' ? 'logo' : 'current'; } catch {}
 document.documentElement.dataset.theme = selected;
 document.addEventListener('DOMContentLoaded', () => {
  const drawer = document.querySelector('.theme-drawer');
  const opener = document.querySelector('.theme-toggle');
  const options = [...document.querySelectorAll('[data-theme-choice]')];
  const update = () => {
   document.documentElement.dataset.theme = selected;
   options.forEach(option => option.setAttribute('aria-pressed', String(option.dataset.themeChoice === selected)));
  };
  const close = () => { drawer.close(); opener.setAttribute('aria-expanded', 'false'); };
  opener.addEventListener('click', () => { drawer.showModal(); opener.setAttribute('aria-expanded', 'true'); });
  drawer.querySelector('.theme-close').addEventListener('click', close);
  drawer.addEventListener('close', () => { opener.setAttribute('aria-expanded', 'false'); opener.focus(); });
  drawer.addEventListener('click', event => { if (event.target === drawer && event.clientX < drawer.getBoundingClientRect().left) close(); });
  options.forEach(option => option.addEventListener('click', () => {
   selected = option.dataset.themeChoice;
   update();
   try { localStorage.setItem(storageKey, selected); } catch {}
   drawer.querySelector('[role="status"]').textContent = selected === 'logo' ? 'Palette du logo appliquée.' : 'Thème actuel appliqué.';
  }));
  update();
 });
})();

