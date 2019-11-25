(function() {
  const header = document.getElementById('header');
  const burger = document.getElementById('burger');

  if (!header || !burger) return;

  burger.addEventListener('click', () => {
    header.classList.toggle('header--open');
  });

  document.addEventListener('click', e => {
    if (header.contains(e.target)) return;
    header.classList.remove('header--open');
  });
})();
