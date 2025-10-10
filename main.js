// Константи
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
  "masaz-price-1h": [
    { time: "1h", price: 150.00 }
  ],
  "masaz-glowy": [
    { time: "30min", price: 90.00 }
  ],
  "masaz-stop-40min": [
    { time: "30min", price: 90.00 }
  ]
};

// Ініціалізація після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
  initPrices();
  initGallery();
  initHeaderScroll();
  initSmoothScroll();
});

// Функція для ініціалізації цін
function initPrices() {
  document.querySelectorAll(".service").forEach(service => {
    const key = service.dataset.service;
    const list = service.querySelector(".price-list");

    if (prices[key] && list) {
      list.innerHTML = prices[key].map(p => {
        const discounted = (p.price * (1 - DISCOUNT)).toFixed(2);
        return `
          <div style="display: flex; justify-content: space-between; align-items: center; margin: 8px 0; padding: 8px; background: rgba(227, 189, 130, 0.05); border-radius: 6px;">
            <span style="text-decoration: line-through; opacity: 0.6; font-size: 0.9rem;">${p.price.toFixed(2)} zł</span>
            <span style="color: var(--accent); font-weight: bold; font-size: 1.1rem;">${discounted} zł</span>
            <span style="opacity: 0.8;">${p.time}</span>
          </div>
        `;
      }).join("");
    }
  });
}

// Функція для ініціалізації галереї
function initGallery() {
  const grid = document.querySelector('.gallery-grid');
  if (!grid) return;

  const imgs = Array.from(grid.querySelectorAll('img'));
  if (imgs.length === 0) return;

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('close');

  if (!lightbox || !lightboxImg || !closeBtn) return;

  let currentIndex = -1;

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = imgs[index].dataset.large || imgs[index].src;
    lightbox.classList.add('visible');
    document.body.style.overflow = 'hidden';
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    lightbox.classList.remove('visible');
    lightboxImg.src = '';
    document.body.style.overflow = '';
    lightbox.setAttribute('aria-hidden', 'true');
    currentIndex = -1;
  }

  function nextImage() {
    if (currentIndex < imgs.length - 1) {
      openLightbox(currentIndex + 1);
    }
  }

  function prevImage() {
    if (currentIndex > 0) {
      openLightbox(currentIndex - 1);
    }
  }

  // Відкриття зображення
  imgs.forEach((img, i) => {
    img.addEventListener('click', () => openLightbox(i));
    img.style.cursor = 'pointer';
  });

  // Закриття
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Навігація клавішами
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('visible')) return;
    
    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
    }
  });
}

// Функція для приховування/показування хедера при скролі
function initHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;

  let lastScroll = 0;
  let ticking = false;

  function updateHeader() {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      header.style.transform = 'translateY(0)';
      header.style.boxShadow = 'none';
    } else {
      if (currentScroll > lastScroll && currentScroll > 100) {
        // Скрол вниз — ховаємо хедер
        header.style.transform = 'translateY(-100%)';
      } else {
        // Скрол вгору — показуємо хедер
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

  // Додаємо transition для плавності
  header.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
}

// Функція для плавного скролу до секцій
function initSmoothScroll() {
  document.querySelectorAll('nav button, .logo').forEach(element => {
    element.addEventListener('click', function(e) {
      const href = this.getAttribute('onclick');
      if (href && href.includes('#')) {
        e.preventDefault();
        const targetId = href.match(/#([^']+)/)[1];
        const target = document.getElementById(targetId);
        
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// Анімація появи елементів при скролі
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Спостереження за елементами
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.service, .person, .gallery-grid img');
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});
