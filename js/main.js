// Taata Owen Supermarket — shared site behaviour

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // Highlight the current page in the nav
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === current) link.classList.add('active');
  });
});
