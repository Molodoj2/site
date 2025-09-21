document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.gallery-grid');
  if (!grid) return console.error('Не знайдено .gallery-grid в DOM');

  const imgs = Array.from(grid.querySelectorAll('img'));
  if (imgs.length === 0) return console.warn('У .gallery-grid немає зображень');

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('close');

  if (!lightbox || !lightboxImg || !closeBtn) {
    return console.error('Відсутні елементи lightbox (перевір ID #lightbox, #lightbox-img, #close)');
  }

  let currentIndex = -1;

  function open(index) {
    currentIndex = index;
    lightboxImg.src = imgs[index].dataset.large || imgs[index].src;
    lightbox.classList.add('visible');
    document.body.style.overflow = 'hidden';
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function close() {
    lightbox.classList.remove('visible');
    lightboxImg.src = '';
    document.body.style.overflow = '';
    lightbox.setAttribute('aria-hidden', 'true');
  }

  imgs.forEach((img, i) => {
    img.addEventListener('click', () => open(i));
  });

  closeBtn.addEventListener('click', close);

  // Закрити клікнувши поза картинкою
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  // Клавіші: Esc закрити
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('visible')) return;
    if (e.key === 'Escape') close();
  });
});
