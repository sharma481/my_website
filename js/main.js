/*
* Main JavaScript
* Author: John Doe & Manish Sharma
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
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });
}

// Typed.js Initialization
if (document.querySelector('.typed') && typeof Typed !== 'undefined') {
  let typed_strings = document.querySelector('.typed').getAttribute('data-typed-items');
  if (typed_strings) {
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 90,
      backSpeed: 45,
      backDelay: 2000
    });
  }
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
  setTheme('dark');
} else {
  setTheme('light');
}

// Theme Toggle Event Listener
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  });
}

// Navbar Scroll Function
function navbarShrink() {
  if (!navbar) return;
  if (window.scrollY > 80) {
    navbar.classList.add('navbar-shrink');
  } else {
    navbar.classList.remove('navbar-shrink');
  }
}

// Back To Top Button Function
function toggleBackToTopButton() {
  if (!backToTopBtn) return;
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
  
  // Portfolio filtering (Isotope or Vanilla JS fallback)
  if (document.querySelector('.portfolio-grid')) {
    if (typeof Isotope !== 'undefined') {
      setTimeout(() => {
        const iso = new Isotope('.portfolio-grid', {
          itemSelector: '.portfolio-item',
          layoutMode: 'fitRows'
        });
        
        portfolioFilters.forEach(filter => {
          filter.addEventListener('click', function() {
            portfolioFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            iso.arrange({ filter: filterValue });
          });
        });
      }, 500);
    } else {
      // Vanilla JavaScript portfolio filter fallback
      portfolioFilters.forEach(filter => {
        filter.addEventListener('click', function() {
          portfolioFilters.forEach(f => f.classList.remove('active'));
          this.classList.add('active');
          
          const filterValue = this.getAttribute('data-filter');
          portfolioItems.forEach(item => {
            if (filterValue === '*' || item.classList.contains(filterValue.substring(1))) {
              item.style.display = 'block';
            } else {
              item.style.display = 'none';
            }
          });
        });
      });
    }
  }
});

// Animate skill bars when they come into view
function animateSkillBars() {
  const bars = document.querySelectorAll('.skill-progress');
  bars.forEach(bar => {
    const barPosition = bar.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.2;
    
    if (barPosition < screenPosition) {
      const width = bar.getAttribute('data-width');
      if (width) {
        bar.style.setProperty('--skill-percent', width);
        bar.style.width = width;
      }
    }
  });
}

// Update active nav link based on scroll position
function updateActiveNavLink() {
  const scrollPosition = window.scrollY + 200;
  
  document.querySelectorAll('section[id]').forEach(section => {
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
    const targetId = this.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      e.preventDefault();
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 70,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) {
            bsCollapse.hide();
          } else {
            navbarCollapse.classList.remove('show');
          }
        }
      }
    }
  });
});

// Back to top button click event
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Contact form submission
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    
    setTimeout(() => {
      alert('Thank you for your message, Manish will get back to you soon!');
      this.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }, 1200);
  });
}
