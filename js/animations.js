/*
* Animations JavaScript
* Author: John Doe
*/

// DOM Elements
const heroTitle = document.querySelector('.hero-title');
const heroImage = document.querySelector('.hero-image');
const timelineItems = document.querySelectorAll('.timeline-item');
const portfolioCards = document.querySelectorAll('.portfolio-card');

// Hero Title Letter Animation
if (heroTitle) {
  const textContent = heroTitle.innerHTML;
  const textWithSpans = textContent.replace(/([^\s<>]+)(?=\s|$|<)/g, '<span class="hero-letter">$1</span>');
  heroTitle.innerHTML = textWithSpans;
  
  const letters = heroTitle.querySelectorAll('.hero-letter');
  letters.forEach((letter, index) => {
    letter.style.animationDelay = `${index * 0.1}s`;
    letter.classList.add('hero-letter-animation');
  });
}

// Hero Image Animation
if (heroImage) {
  heroImage.addEventListener('mouseenter', () => {
    heroImage.classList.add('hero-image-hover');
  });
  
  heroImage.addEventListener('mouseleave', () => {
    heroImage.classList.remove('hero-image-hover');
  });
}

// Timeline Animation on Hover
timelineItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.classList.add('timeline-item-hover');
  });
  
  item.addEventListener('mouseleave', () => {
    item.classList.remove('timeline-item-hover');
  });
});

// Portfolio Cards Hover Effects
portfolioCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.classList.add('portfolio-card-hover');
  });
  
  card.addEventListener('mouseleave', () => {
    card.classList.remove('portfolio-card-hover');
  });
});

// Scroll-triggered animations for elements without AOS
document.addEventListener('DOMContentLoaded', () => {
  // Fallback for browsers that don't support AOS
  if (!window.AOS) {
    const animatedElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .zoom-in');
    
    function checkVisibility() {
      animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight * 0.8) {
          element.classList.add('visible');
        }
      });
    }
    
    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Check on page load
  }
});

// Additional animation for skill bars to ensure they're properly animated
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillBar = entry.target;
        const width = skillBar.getAttribute('data-width');
        skillBar.style.width = width;
        observer.unobserve(skillBar);
      }
    });
  }, { threshold: 0.5 });
  
  const skillBars = document.querySelectorAll('.skill-progress');
  skillBars.forEach(bar => {
    observer.observe(bar);
  });
});

// Parallax effect for the hero section
window.addEventListener('scroll', () => {
  const scrollPosition = window.pageYOffset;
  if (document.querySelector('.hero')) {
    document.querySelector('.hero').style.backgroundPositionY = `${scrollPosition * 0.5}px`;
  }
});

// Cursor effect for interactive elements
document.addEventListener('DOMContentLoaded', () => {
  const interactiveElements = document.querySelectorAll('.btn, .nav-link, .social-icon, .portfolio-card');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      document.body.classList.add('link-hovered');
    });
    
    element.addEventListener('mouseleave', () => {
      document.body.classList.remove('link-hovered');
    });
  });
});

// Image reveal animation
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.about-image img, .portfolio-image img');
  
  images.forEach(image => {
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.classList.add('image-reveal-wrapper');
    
    // Create reveal overlay
    const overlay = document.createElement('div');
    overlay.classList.add('image-reveal-overlay');
    
    // Set up the structure
    image.parentNode.insertBefore(wrapper, image);
    wrapper.appendChild(image);
    wrapper.appendChild(overlay);
    
    // Animate on intersection
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          overlay.classList.add('reveal');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(wrapper);
  });
});

// Add CSS for image reveal animation
const style = document.createElement('style');
style.textContent = `
  .image-reveal-wrapper {
    position: relative;
    overflow: hidden;
  }
  
  .image-reveal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--primary);
    transform: translateX(0);
    transition: transform 1.2s cubic-bezier(0.19, 1, 0.22, 1);
    z-index: 1;
  }
  
  .image-reveal-overlay.reveal {
    transform: translateX(100%);
  }
  
  .hero-letter-animation {
    display: inline-block;
    opacity: 0;
    transform: translateY(20px);
    animation: heroLetterIn 0.6s forwards;
  }
  
  @keyframes heroLetterIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .timeline-item-hover .timeline-content {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
  
  .portfolio-card-hover {
    z-index: 5;
  }
  
  body.link-hovered {
    cursor: pointer;
  }
  
  .hero-image-hover img {
    transform: scale(1.05) rotate(2deg);
  }
`;
document.head.appendChild(style);

// Text scramble effect for section titles
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);
    this.queue = [];
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  
  update() {
    let output = '';
    let complete = 0;
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="scramble">${char}</span>`;
      } else {
        output += from;
      }
    }
    
    this.el.innerHTML = output;
    
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Apply text scramble effect to section titles on intersection
document.addEventListener('DOMContentLoaded', () => {
  const sectionTitles = document.querySelectorAll('.section-title');
  
  sectionTitles.forEach(title => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const text = title.textContent;
          const fx = new TextScramble(title);
          fx.setText(text);
          observer.unobserve(title);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(title);
  });
});