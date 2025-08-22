/*
* Main JavaScript
* Author: John Doe
*/

// DOM Elements
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const backToTopBtn = document.querySelector('.back-to-top');
const navbar = document.getElementById('mainNav');
const skillBars = document.querySelectorAll('.skill-progress');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const portfolioFilters = document.querySelectorAll('.portfolio-filter');
const portfolioItems = document.querySelectorAll('.portfolio-item');

// Initialize AOS (Animate on Scroll)
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
  mirror: false
});

// Typed.js Initialization
if (document.querySelector('.typed')) {
  let typed_strings = document.querySelector('.typed').getAttribute('data-typed-items');
  typed_strings = typed_strings.split(',');
  
  new Typed('.typed', {
    strings: typed_strings,
    loop: true,
    typeSpeed: 100,
    backSpeed: 50,
    backDelay: 2000
  });
}

// Theme Toggle Function
function setTheme(themeName) {
  localStorage.setItem('theme', themeName);
  document.documentElement.setAttribute('data-theme', themeName);
}

// Check for saved user preference, if any
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme);
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  // Use dark theme if user prefers dark mode
  setTheme('dark');
} else {
  // Default to light theme
  setTheme('light');
}

// Theme Toggle Event Listener
themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'light') {
    setTheme('dark');
  } else {
    setTheme('light');
  }
});

// Navbar Scroll Function
function navbarShrink() {
  if (window.scrollY > 100) {
    navbar.classList.add('navbar-shrink');
  } else {
    navbar.classList.remove('navbar-shrink');
  }
}

// Back To Top Button Function
function toggleBackToTopButton() {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('active');
  } else {
    backToTopBtn.classList.remove('active');
  }
}

// Scroll Event Listeners
window.addEventListener('scroll', () => {
  navbarShrink();
  toggleBackToTopButton();
  animateSkillBars();
  updateActiveNavLink();
});

// Initialize functions on page load
document.addEventListener('DOMContentLoaded', () => {
  navbarShrink();
  toggleBackToTopButton();
  
  // Initialize Isotope for portfolio filtering
  if (document.querySelector('.portfolio-grid')) {
    setTimeout(() => {
      const iso = new Isotope('.portfolio-grid', {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });
      
      // Portfolio filter event listeners
      portfolioFilters.forEach(filter => {
        filter.addEventListener('click', function() {
          portfolioFilters.forEach(f => f.classList.remove('active'));
          this.classList.add('active');
          
          const filterValue = this.getAttribute('data-filter');
          iso.arrange({ filter: filterValue });
        });
      });
    }, 1000);
  }
});

// Animate skill bars when they come into view
function animateSkillBars() {
  skillBars.forEach(bar => {
    const barPosition = bar.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.2;
    
    if (barPosition < screenPosition) {
      const width = bar.getAttribute('data-width');
      bar.style.setProperty('--skill-percent', width);
      bar.style.width = width;
    }
  });
}

// Update active nav link based on scroll position
function updateActiveNavLink() {
  const scrollPosition = window.scrollY + 200;
  
  document.querySelectorAll('section').forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

// Smooth scrolling for nav links
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId.startsWith('#')) {
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 70,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
          navbarCollapse.classList.remove('show');
        }
      }
    }
  });
});

// Back to top button click event
backToTopBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Contact form submission
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simulate form submission (would be replaced with actual form submission)
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Display success message
      alert('Thank you for your message! I will get back to you soon.');
      
      // Reset form
      this.reset();
      
      // Reset button
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }, 1500);
  });
}