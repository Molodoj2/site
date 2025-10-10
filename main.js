// --- Константи ---
const DISCOUNT = 0.20; // 20%

const prices = {
  "masaz-normal-price": [
    { time: "1h", price: 150.00 },
    { time: "1h 30min", price: 200.00 }
  ],
  "masaz-price-40min": [
    { time: "40min", price: 120.00 },
    { time: "1h", price: 150.00 }
  ],
  "masaz-dla-dwojga": [
    { time: "1h", price: 300.00 }
  ],
  "masaz-stop": [
    { time: "40min", price: 100.00 },
    { time: "1h", price: 140.00 }
  ],
  "masaz-twarzy": [
    { time: "1h 30min", price: 200.00 }
  ],
  "masaz-glowy": [
    { time: "30min", price: 90.00 }
  ]
};

// --- Глобальний стан галереї ---
let galleryState = {
  currentIndex: 0,
  images: [],
  lightbox: null,
  lightboxImg: null
};

// --- Ініціалізація після завантаження ---
document.addEventListener('DOMContentLoaded', () => {
  initPrices();
  initGallery();
  initHeaderScroll();
  initSmoothScroll();
  initScrollAnimations();
});

// --- Ініціалізація цін ---
function initPrices() {
  document.querySelectorAll(".service").forEach(service => {
    const key = service.dataset.service;
    const list = service.querySelector(".price-list");

    if (!prices[key] || !list) return;

    list.innerHTML = prices[key].map(p => {
      const discounted = (p.price * (1 - DISCOUNT)).toFixed(2);
      return `
        <div class="price-item">
          <span class="old-price">${p.price.toFixed(2)} zł</span>
          <span class="new-price">${discounted} zł</span>
          <span class="time">${p.time}</span>
        </div>
      `;
    }).join("");
  });
}

// --- Ініціалізація галереї ---
function initGallery() {
  const galleryScroll = document.querySelector('.gallery-scroll');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const scrollLeftBtn = document.querySelector('.scroll-left');
  const scrollRightBtn = document.querySelector('.scroll-right');

  galleryState.lightbox = document.getElementById('lightbox');
  galleryState.lightboxImg = document.getElementById('lightbox-img');

  if (!galleryScroll || !galleryItems.length || !galleryState.lightbox) return;

  const closeBtn = document.getElementById('close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  const currentImageSpan = document.getElementById('current-image');
  const totalImagesSpan = document.getElementById('total-images');

  galleryState.images = Array.from(galleryItems)
    .map(i => i.querySelector('img')?.src)
    .filter(Boolean);

  if (totalImagesSpan) totalImagesSpan.textContent = galleryState.images.length;

  const scrollByAmount = 425;

  scrollLeftBtn?.addEventListener('click', () => {
    galleryScroll.scrollBy({ left: -scrollByAmount, behavior: 'smooth' });
  });

  scrollRightBtn?.addEventListener('click', () => {
    galleryScroll.scrollBy({ left: scrollByAmount, behavior: 'smooth' });
  });

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', showPrevImage);
  nextBtn?.addEventListener('click', showNextImage);

  galleryState.lightbox.addEventListener('click', e => {
    if (e.target === galleryState.lightbox) closeLightbox();
  });

  document.addEventListener('keydown', handleLightboxKeys);

  let startX = 0;
  galleryState.lightbox.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  galleryState.lightbox.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) diff > 0 ? showPrevImage() : showNextImage();
  });

  function updateCounter() {
    if (currentImageSpan) currentImageSpan.textContent = galleryState.currentIndex + 1;
  }

  function openLightbox(index) {
    galleryState.currentIndex = index;
    galleryState.lightboxImg.src = galleryState.images[index];
    galleryState.lightbox.classList.add('visible');
    document.body.style.overflow = 'hidden';
    updateCounter();
  }

  function closeLightbox() {
    galleryState.lightbox.classList.add('closing');
    setTimeout(() => {
      galleryState.lightbox.classList.remove('visible', 'closing');
      document.body.style.overflow = '';
    }, 250);
  }

  function showNextImage() {
    galleryState.currentIndex = (galleryState.currentIndex + 1) % galleryState.images.length;
    galleryState.lightboxImg.src = galleryState.images[galleryState.currentIndex];
    updateCounter();
  }

  function showPrevImage() {
    galleryState.currentIndex = (galleryState.currentIndex - 1 + galleryState.images.length) % galleryState.images.length;
    galleryState.lightboxImg.src = galleryState.images[galleryState.currentIndex];
    updateCounter();
  }

  function handleLightboxKeys(e) {
    if (!galleryState.lightbox.classList.contains('visible')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  }
}

// --- Приховування/показ хедера ---
function initHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;

  let lastScroll = 0;
  let ticking = false;

  header.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';

  function updateHeader() {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      header.style.transform = 'translateY(0)';
      header.style.boxShadow = 'none';
    } else {
      if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
      }
    }

    lastScroll = currentScroll;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });
}

// --- Плавний скрол ---
function initSmoothScroll() {
  document.querySelectorAll('nav button, .logo').forEach(el => {
    el.addEventListener('click', e => {
      const href = el.getAttribute('onclick');
      if (!href || !href.includes('#')) return;

      e.preventDefault();
      const match = href.match(/#([\w-]+)/);
      if (!match) return;

      const target = document.getElementById(match[1]);
      if (!target) return;

      const headerOffset = 80;
      const offset = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });
}

// --- Анімації при скролі ---
function initScrollAnimations() {
  const elements = document.querySelectorAll('.service, .person, .gallery-item');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
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
