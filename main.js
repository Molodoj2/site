// --- Константи ---
const DISCOUNT = 0.2; // 20%

const prices = {
  "masaz-normal-price": [{ time: "1h", price: 150 }, { time: "1h 30min", price: 200 }],
  "masaz-price-40min": [{ time: "40min", price: 120 }, { time: "1h", price: 150 }],
  "masaz-dla-dwojga": [{ time: "1h", price: 300 }],
  "masaz-stop": [{ time: "40min", price: 100 }, { time: "1h", price: 140 }],
  "masaz-twarzy": [{ time: "1h 30min", price: 200 }],
  "masaz-price-1h": [{ time: "1h", price: 150 }],
  "masaz-glowy": [{ time: "30min", price: 90 }],
  "masaz-stop-40min": [{ time: "30min", price: 90 }]
};

const actions = {
  "actions": "Promocja: -20% na wszystkie masaże do końca Listopada! 🎉 Pakiety i promocje – zapytaj telefonicznie 519 384 960"
};

// --- Ініціалізація ---
document.addEventListener('DOMContentLoaded', () => {
  initPrices();
  initGallery();
  initHeaderScroll();
  initSmoothScroll();
  initScrollAnimations();
  initSlider();
  initMenu();
  initReviews();
});

// --- Ціни ---
function initPrices() {
  document.querySelectorAll(".service").forEach(service => {
    const key = service.dataset.service;
    const list = service.querySelector(".price-list");
    const actionText = actions.actions;

    if (actionText && !service.querySelector('.actions')) {
      const actionEl = document.createElement('div');
      actionEl.className = 'actions';
      actionEl.textContent = actionText;
      service.appendChild(actionEl);
    }

    const items = prices[key];
    if (!items || !list) return;

    list.innerHTML = items.map(({ time, price }) => `
      <div class="price-item">
        <span class="old-price">${price.toFixed(2)} zł</span>
        <span class="new-price">${(price * (1 - DISCOUNT)).toFixed(2)} zł</span>
        <span class="time">${time}</span>
      </div>
    `).join("");
  });
}

// --- Галерея ---
function initGallery() {
  const galleryScroll = document.querySelector('.gallery-scroll');
  const galleryItems = [...document.querySelectorAll('.gallery-item')];
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  const currentSpan = document.getElementById('current-image');
  const totalSpan = document.getElementById('total-images');
  const scrollLeftBtn = document.querySelector('.scroll-left');
  const scrollRightBtn = document.querySelector('.scroll-right');

  if (!galleryScroll || !galleryItems.length || !lightbox) return;

  const images = galleryItems.map(i => i.querySelector('img')?.src).filter(Boolean);
  if (!images.length) return;

  let currentIndex = 0;
  const scrollBy = 425;
  if (totalSpan) totalSpan.textContent = images.length;

  const showImage = i => {
    currentIndex = (i + images.length) % images.length;
    if (lightboxImg) lightboxImg.src = images[currentIndex];
    if (currentSpan) currentSpan.textContent = currentIndex + 1;
  };

  const toggleLightbox = (show, i = 0) => {
    if (!lightbox) return;
    if (show) {
      showImage(i);
      lightbox.classList.add('visible');
      document.body.style.overflow = 'hidden';
    } else {
      lightbox.classList.add('closing');
      setTimeout(() => {
        lightbox.classList.remove('visible', 'closing');
        document.body.style.overflow = '';
      }, 250);
    }
  };

  galleryItems.forEach((item, i) => item.addEventListener('click', () => toggleLightbox(true, i)));
  closeBtn?.addEventListener('click', () => toggleLightbox(false));
  prevBtn?.addEventListener('click', () => showImage(currentIndex - 1));
  nextBtn?.addEventListener('click', () => showImage(currentIndex + 1));
  scrollLeftBtn?.addEventListener('click', () => galleryScroll.scrollBy({ left: -scrollBy, behavior: 'smooth' }));
  scrollRightBtn?.addEventListener('click', () => galleryScroll.scrollBy({ left: scrollBy, behavior: 'smooth' }));

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('visible')) return;
    if (e.key === 'Escape') toggleLightbox(false);
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });

  let startX = 0;
  lightbox.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  lightbox.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) diff > 0 ? showImage(currentIndex - 1) : showImage(currentIndex + 1);
  });
}

// --- Хедер ---
function initHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;

  let lastScroll = 0;
  header.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';

  window.addEventListener('scroll', () => {
    const y = window.pageYOffset;
    header.style.transform = y > lastScroll && y > 100 ? 'translateY(-100%)' : 'translateY(0)';
    header.style.boxShadow = y > 0 ? '0 4px 20px rgba(0,0,0,0.4)' : 'none';
    lastScroll = y;
  });
}

// --- Плавний скрол ---
function initSmoothScroll() {
  document.querySelectorAll('nav button[onclick*="#"], .logo[onclick*="#"]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const match = el.getAttribute('onclick')?.match(/#([\w-]+)/);
      const target = match && document.getElementById(match[1]);
      if (!target) return;

      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth'
      });
    });
  });
}

// --- Анімації ---
function initScrollAnimations() {
  const elements = document.querySelectorAll('.service, .person, .gallery-item');
  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// --- Слайдер ---
function initSlider() {
  const slides = document.getElementById('slides');
  const slidesArray = [...document.querySelectorAll('.slide')];
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const dotsContainer = document.getElementById('dots');

  if (!slides || !slidesArray.length || !dotsContainer) return;

  let current = 0;
  const total = slidesArray.length;

  dotsContainer.innerHTML = slidesArray.map((_, i) => `<div class="dot${i === 0 ? ' active' : ''}"></div>`).join("");
  const dots = [...dotsContainer.children];

  const update = () => {
    slides.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  };

  const next = () => { current = (current + 1) % total; update(); };
  const prev = () => { current = (current - 1 + total) % total; update(); };
  const goTo = i => { current = i; update(); };

  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  let startX = 0;
  slides.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  slides.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) diff > 0 ? prev() : next();
  });

  setInterval(next, 5000);
}

// --- Меню ---
function initMenu() {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('menu');
  if (!hamburger || !menu) return;

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    menu.classList.toggle('active');
  };

  const closeMenu = () => {
    hamburger.classList.remove('active');
    menu.classList.remove('active');
  };

  hamburger.addEventListener('click', toggleMenu);
  menu.querySelectorAll('button').forEach(btn => btn.addEventListener('click', closeMenu));

  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !menu.contains(e.target)) closeMenu();
  });
}

function navigateTo(hash) {
  location.href = hash;
  const menu = document.getElementById('menu');
  const hamburger = document.getElementById('hamburger');
  if (menu && hamburger) {
    menu.classList.remove('active');
    hamburger.classList.remove('active');
  }
}
// --- Додати кнопку "Вгору" ---
function initScrollToTop() {
  const btn = document.createElement('button');
  btn.id = 'scroll-to-top';
  btn.textContent = '↑';
  document.body.appendChild(btn);

  // Показ кнопки після прокрутки
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.pageYOffset > 300);
  });

  // Плавний скрол вгору
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollToTop();
});
