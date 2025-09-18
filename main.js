// Prosta obsługa formularza rezerwacji online
document.getElementById('bookingForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const form = e.target;
  const msg = document.getElementById('formMsg');
  msg.textContent = "Wysyłanie...";
  msg.style.color = "#333";
  setTimeout(() => {
    msg.textContent = "Dziękujemy! Skontaktujemy się w celu potwierdzenia rezerwacji.";
    msg.style.color = "#4e944f";
    form.reset();
  }, 1200);
});
// Płynne przewijanie po nawigacji
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function(e){
    const href = link.getAttribute('href');
    if(href && href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({behavior: 'smooth'});
    }
  });
});