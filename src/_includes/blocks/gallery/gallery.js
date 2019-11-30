(function() {
  const gallery = document.getElementById('gallery');

  if (!gallery) return;

  const frame = document.getElementById('gallery-frame');
  const leftButton = document.getElementById('gallery-button-left');
  const rightButton = document.getElementById('gallery-button-right');
  const dots = gallery.querySelectorAll('.gallery__dot');

  const TRANSITION_DURATION = 420;
  const TRANSITION_INTERVAL = 4000;

  let interval = null;
  let isAnimated = false;
  let currentIndex = 0;
  let length = frame.children.length;

  getItem(0).firstChild.addEventListener('load', () => {
    interval = setInterval(() => choose(currentIndex + 1), TRANSITION_INTERVAL);
  });

  function getItem(i) {
    return document.getElementById('gallery-item-' + i);
  }

  function getDot(i) {
    return document.getElementById('gallery-dot-' + i);
  }

  function choose(i) {
    i = (length + i) % length;

    const current = getItem(currentIndex);
    const next = getItem(i);
    
    const currentDot = getDot(currentIndex);
    const nextDot = getDot(i);

    frame.setAttribute('style', `background-image: url("${getItem(currentIndex).getAttribute('data-photo')}")`);
    frame.appendChild(next);

    currentIndex = i;

    setTimeout(() => {
      current.classList.remove('gallery__item--active');
      next.classList.add('gallery__item--active');

      currentDot.classList.remove('gallery__dot--active');
      nextDot.classList.add('gallery__dot--active');
    }, 20)
  }

  function handleClick(cb) {
    if (isAnimated) return;

    isAnimated = true;
    setTimeout(() => isAnimated = false, TRANSITION_DURATION);

    cb();
  }

  leftButton.addEventListener('click', () => handleClick(() => {
    choose(currentIndex - 1);
    clearInterval(interval);
  }));

  rightButton.addEventListener('click', () => handleClick(() => {
    choose(currentIndex + 1);
    clearInterval(interval);
  }));

  for (let i = 0; i < dots.length; i++) {
    dots[i].addEventListener('click', e => {
      const index = e.target.getAttribute('data-index');

      choose(index);
      clearInterval(interval);
    });
  }
})();