// JavaScript for managing animations and dynamic effects on the website

// Fade-in animation on scroll
document.addEventListener('DOMContentLoaded', () => {
  const fadeInElements = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible'); // Adds "visible" class to trigger fade-in
      }
    });
  });

  fadeInElements.forEach(el => observer.observe(el));
});

// Highlight navigation links on click
document.querySelectorAll('nav ul li a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    // Remove highlight from all links
    document.querySelectorAll('nav ul li a').forEach(a => a.classList.remove('highlight', 'fade-out'));

    // Add highlight to the selected link
    this.classList.add('highlight');

    // Fade out the highlight after 1 second
    setTimeout(() => {
      this.classList.add('fade-out');
    }, 1000);

    // Smooth scroll to the target section
    const targetId = this.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});