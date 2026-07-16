// ==========================================
// MOBILE NAVIGATION HANDLER
// ==========================================

(function() {
  'use strict';

  // Only run on mobile/tablet
  if (window.innerWidth > 767) {
    return;
  }

  // Wait for DOM to be ready
  function initMobileNav() {
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.navlinks');
    
    if (!nav || !navLinks) {
      console.warn('Navigation elements not found');
      return;
    }

    // Create mobile menu button
    const menuBtn = document.createElement('div');
    menuBtn.className = 'mobile-menu-btn';
    menuBtn.innerHTML = '<span></span><span></span><span></span>';
    menuBtn.setAttribute('aria-label', 'Toggle menu');
    menuBtn.setAttribute('role', 'button');
    menuBtn.setAttribute('tabindex', '0');

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';

    // Add to DOM
    nav.appendChild(menuBtn);
    document.body.appendChild(overlay);

    // Toggle menu function
    function toggleMenu() {
      const isActive = menuBtn.classList.contains('active');
      
      if (isActive) {
        // Close menu
        menuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        // Open menu
        menuBtn.classList.add('active');
        navLinks.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    // Event listeners
    menuBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Keyboard support
    menuBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    });

    // Close menu when clicking a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', function() {
        toggleMenu();
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menuBtn.classList.contains('active')) {
        toggleMenu();
      }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        if (window.innerWidth > 767) {
          // Desktop view - reset mobile menu
          menuBtn.classList.remove('active');
          navLinks.classList.remove('active');
          overlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      }, 250);
    });

    console.log('Mobile navigation initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }

  // ==========================================
  // TOUCH GESTURE SUPPORT
  // ==========================================
  
  let touchStartX = 0;
  let touchEndX = 0;

  function handleSwipe() {
    const navLinks = document.querySelector('.navlinks');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const overlay = document.querySelector('.mobile-overlay');
    
    if (!navLinks || !menuBtn || !overlay) return;

    // Swipe left to close menu
    if (touchEndX < touchStartX - 50 && navLinks.classList.contains('active')) {
      menuBtn.classList.remove('active');
      navLinks.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Swipe right from edge to open menu
    if (touchEndX > touchStartX + 50 && touchStartX < 50 && !navLinks.classList.contains('active')) {
      menuBtn.classList.add('active');
      navLinks.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  // ==========================================
  // MOBILE SCROLL PERFORMANCE
  // ==========================================

  // Throttle scroll events for better performance
  let ticking = false;
  let lastScrollY = window.scrollY;
  const navElement = document.querySelector('nav');

  function updateNav() {
    const scrollY = window.scrollY;
    
    if (navElement) {
      // Hide nav on scroll down, show on scroll up
      if (scrollY > lastScrollY && scrollY > 100) {
        navElement.style.transform = 'translateY(-100%)';
      } else {
        navElement.style.transform = 'translateY(0)';
      }
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking && window.innerWidth <= 767) {
      window.requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // Add smooth transition to nav
  if (navElement && window.innerWidth <= 767) {
    navElement.style.transition = 'transform 0.3s ease';
  }

})();

// ==========================================
// VIEWPORT HEIGHT FIX (for mobile browsers)
// ==========================================

(function() {
  'use strict';

  function setVH() {
    // Get actual viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  // Set on load
  setVH();

  // Update on resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setVH, 100);
  });

  // Update on orientation change
  window.addEventListener('orientationchange', function() {
    setTimeout(setVH, 100);
  });

})();

// ==========================================
// MOBILE FORM IMPROVEMENTS
// ==========================================

(function() {
  'use strict';

  // Prevent zoom on input focus (iOS)
  const addMaximumScaleToMetaViewport = () => {
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      const content = metaViewport.getAttribute('content');
      if (content && !content.includes('maximum-scale')) {
        metaViewport.setAttribute('content', content + ', maximum-scale=1.0');
      }
    }
  };

  // Only on touch devices
  if ('ontouchstart' in window) {
    addMaximumScaleToMetaViewport();
  }

})();

// ==========================================
// SAFE AREA INSETS (for notched devices)
// ==========================================

(function() {
  'use strict';

  // Check if device has safe area insets
  if (CSS.supports('padding-top: env(safe-area-inset-top)')) {
    // Add padding to nav and other fixed elements
    const nav = document.querySelector('nav');
    if (nav) {
      nav.style.paddingTop = 'calc(22px + env(safe-area-inset-top))';
    }

    const hudCorner = document.querySelector('.hud-corner');
    if (hudCorner) {
      hudCorner.style.bottom = 'calc(22px + env(safe-area-inset-bottom))';
      hudCorner.style.left = 'calc(32px + env(safe-area-inset-left))';
    }
  }

})();

// ==========================================
// PERFORMANCE MONITORING (Development only)
// ==========================================

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  (function() {
    'use strict';

    // Log viewport info
    console.log('📱 Mobile Optimization Active');
    console.log('Viewport:', window.innerWidth + 'x' + window.innerHeight);
    console.log('Device Pixel Ratio:', window.devicePixelRatio);
    console.log('Touch Support:', 'ontouchstart' in window);
    console.log('Connection:', navigator.connection ? navigator.connection.effectiveType : 'unknown');

    // Log performance metrics
    window.addEventListener('load', function() {
      setTimeout(function() {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;

        console.log('⚡ Performance Metrics:');
        console.log('Page Load Time:', pageLoadTime + 'ms');
        console.log('Connection Time:', connectTime + 'ms');
        console.log('Render Time:', renderTime + 'ms');
      }, 0);
    });

  })();
}
