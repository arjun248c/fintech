/*
  ========================================
  JAVASCRIPT — Making the page interactive
  ========================================
  This file handles all the dynamic behavior of our webpage:
  1. Shrinking/darkening the navbar when scrolling
  2. Mobile hamburger menu toggle
  3. Smooth scrolling for navigation links
  4. Revealing elements as they scroll into view (Intersection Observer)
  5. Animating the statistic numbers to count up
*/

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. NAVBAR SCROLL EFFECT ---
  // When you scroll down, the navbar gets a solid background
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- 2. MOBILE HAMBURGER MENU ---
  // Toggles the visibility of navigation links on small screens
  const toggleBtn = document.getElementById('navbar-toggle');
  const navLinks = document.getElementById('navbar-links');
  
  toggleBtn.addEventListener('click', () => {
    // We toggle a 'active' class which we will style in CSS
    navLinks.classList.toggle('active');
    
    // Animate the hamburger lines into an 'X'
    const spans = toggleBtn.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(span => {
        span.style.transform = 'none';
        span.style.opacity = '1';
      });
    }
  });

  // --- 3. SCROLL REVEAL ANIMATION ---
  // We use IntersectionObserver to detect when an element enters the screen
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2 // Trigger when 20% of the element is visible (FIS enterprise staggering)
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // If the element is now visible on screen
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // If it's a statistic number, trigger the counting animation
        if (entry.target.classList.contains('stat-item')) {
          const numberElement = entry.target.querySelector('.stat-number');
          animateValue(numberElement);
        }
        
        // Stop observing once animated so it doesn't repeat
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Find all elements we want to animate and observe them
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(el => observer.observe(el));

  // --- 4. NUMBER COUNTING ANIMATION ---
  // Makes numbers count up from 0 to their target value
  function animateValue(obj) {
    const text = obj.innerText;
    // Extract numbers, leaving symbols like '+', 'M', '%' intact
    const originalNumber = text.replace(/[^0-9.]/g, ''); 
    const isFloat = text.includes('.');
    const suffix = text.replace(/[0-9.]/g, ''); // Extract the suffix (e.g. 'M+', '%')
    
    const target = parseFloat(originalNumber);
    if (isNaN(target)) return;

    let startTimestamp = null;
    const duration = 2000; // 2 seconds

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Calculate current value based on progress, using easeOut curve
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const current = easeOutProgress * target;
      
      // Format the number properly
      if (isFloat) {
        obj.innerText = current.toFixed(1) + suffix;
      } else {
        obj.innerText = Math.floor(current) + suffix;
      }
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.innerText = text; // Ensure exact final value
      }
    };
    
    window.requestAnimationFrame(step);
  }

  // --- 5. WAITLIST FORM HANDLER ---
  const waitlistForm = document.getElementById('waitlist-form');
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = waitlistForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';
      
      setTimeout(() => {
        submitBtn.innerHTML = 'Message Sent! ✓';
        submitBtn.style.background = '#059669';
        
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          waitlistForm.reset();
        }, 3000);
      }, 1500);
    });
  }

});
