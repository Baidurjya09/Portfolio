// ==========================================
// PWA INITIALIZATION
// ==========================================

(function() {
  'use strict';

  // ==========================================
  // SERVICE WORKER REGISTRATION
  // ==========================================
  
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
          console.log('✅ ServiceWorker registered:', registration.scope);
          
          // Check for updates every hour
          setInterval(function() {
            registration.update();
          }, 3600000);
          
          // Handle updates
          registration.addEventListener('updatefound', function() {
            const newWorker = registration.installing;
            
            newWorker.addEventListener('statechange', function() {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                showUpdateNotification();
              }
            });
          });
        })
        .catch(function(error) {
          console.warn('❌ ServiceWorker registration failed:', error);
        });

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', function() {
        console.log('🔄 ServiceWorker controller changed');
        // Optionally reload the page
        // window.location.reload();
      });
    });
  }

  // ==========================================
  // UPDATE NOTIFICATION
  // ==========================================
  
  function showUpdateNotification() {
    // Create update notification
    const notification = document.createElement('div');
    notification.id = 'pwa-update-notification';
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--crimson, #ff2e3e);
      color: #fff;
      padding: 16px 24px;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      animation: slideUp 0.3s ease;
    `;
    
    notification.innerHTML = `
      <span>🔄 New version available!</span>
      <button id="pwa-reload-btn" style="
        background: #fff;
        color: var(--crimson, #ff2e3e);
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        cursor: pointer;
        font-weight: bold;
      ">RELOAD</button>
      <button id="pwa-close-btn" style="
        background: transparent;
        color: #fff;
        border: 1px solid #fff;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
      ">✕</button>
    `;
    
    document.body.appendChild(notification);
    
    // Reload button
    document.getElementById('pwa-reload-btn').addEventListener('click', function() {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    });
    
    // Close button
    document.getElementById('pwa-close-btn').addEventListener('click', function() {
      notification.remove();
    });
    
    // Auto-hide after 10 seconds
    setTimeout(function() {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 10000);
  }

  // ==========================================
  // INSTALL PROMPT
  // ==========================================
  
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', function(e) {
    console.log('💾 Install prompt available');
    
    // Prevent the default prompt
    e.preventDefault();
    deferredPrompt = e;
    
    // Show custom install button
    showInstallButton();
  });

  function showInstallButton() {
    // Only show on mobile
    if (window.innerWidth > 767) return;
    
    // Check if already shown
    if (localStorage.getItem('pwa-install-dismissed')) return;
    
    const installBanner = document.createElement('div');
    installBanner.id = 'pwa-install-banner';
    installBanner.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--ink-2, #111418);
      color: var(--paper, #ede8de);
      padding: 16px 20px;
      border-radius: 12px;
      border: 1px solid var(--line, rgba(237,232,222,0.14));
      font-family: 'Space Grotesk', sans-serif;
      font-size: 14px;
      z-index: 99998;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      max-width: 90%;
      animation: slideUp 0.3s ease;
    `;
    
    installBanner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <img src="images/logo.png" alt="Logo" style="width: 32px; height: 32px; border-radius: 4px;">
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">Install Portfolio App</div>
          <div style="font-size: 12px; opacity: 0.7;">Add to home screen for quick access</div>
        </div>
      </div>
      <div style="display: flex; gap: 8px;">
        <button id="pwa-install-btn" style="
          flex: 1;
          background: var(--crimson, #ff2e3e);
          color: #fff;
          border: none;
          padding: 10px 16px;
          border-radius: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          cursor: pointer;
          font-weight: bold;
          letter-spacing: 0.5px;
        ">INSTALL</button>
        <button id="pwa-dismiss-btn" style="
          background: transparent;
          color: var(--paper, #ede8de);
          border: 1px solid var(--line, rgba(237,232,222,0.14));
          padding: 10px 16px;
          border-radius: 6px;
          font-size: 11px;
          cursor: pointer;
        ">NOT NOW</button>
      </div>
    `;
    
    document.body.appendChild(installBanner);
    
    // Install button click
    document.getElementById('pwa-install-btn').addEventListener('click', async function() {
      if (!deferredPrompt) return;
      
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('Install outcome:', outcome);
      
      if (outcome === 'accepted') {
        console.log('✅ PWA installed');
      }
      
      deferredPrompt = null;
      installBanner.remove();
    });
    
    // Dismiss button click
    document.getElementById('pwa-dismiss-btn').addEventListener('click', function() {
      localStorage.setItem('pwa-install-dismissed', 'true');
      installBanner.remove();
    });
    
    // Auto-hide after 15 seconds
    setTimeout(function() {
      if (installBanner.parentNode) {
        installBanner.remove();
      }
    }, 15000);
  }

  // ==========================================
  // APP INSTALLED EVENT
  // ==========================================
  
  window.addEventListener('appinstalled', function() {
    console.log('✅ PWA installed successfully');
    deferredPrompt = null;
    
    // Remove install banner if present
    const banner = document.getElementById('pwa-install-banner');
    if (banner) banner.remove();
    
    // Show success message
    showToast('App installed successfully! 🎉');
  });

  // ==========================================
  // ONLINE/OFFLINE DETECTION
  // ==========================================
  
  window.addEventListener('online', function() {
    console.log('🌐 Back online');
    showToast('You are back online! 🌐', 'success');
  });

  window.addEventListener('offline', function() {
    console.log('📴 Offline mode');
    showToast('You are offline. Some features may be limited. 📴', 'warning');
  });

  // ==========================================
  // TOAST NOTIFICATION
  // ==========================================
  
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: ${type === 'success' ? '#00e5ff' : type === 'warning' ? '#ffd400' : 'var(--crimson, #ff2e3e)'};
      color: ${type === 'warning' ? '#0b0d10' : '#fff'};
      padding: 12px 20px;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      z-index: 99999;
      animation: slideInRight 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(function() {
      toast.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(function() {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    }, 3000);
  }

  // ==========================================
  // ANIMATIONS
  // ==========================================
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from {
        transform: translate(-50%, 100px);
        opacity: 0;
      }
      to {
        transform: translate(-50%, 0);
        opacity: 1;
      }
    }
    
    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // ==========================================
  // PERFORMANCE MONITORING
  // ==========================================
  
  if ('performance' in window && 'PerformanceObserver' in window) {
    // Monitor Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('📊 LCP:', lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observer not supported');
    }

    // Monitor First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.log('📊 FID:', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID observer not supported');
    }
  }

  // ==========================================
  // CACHE STORAGE INFO (Development)
  // ==========================================
  
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then((estimate) => {
        console.log('💾 Storage:', {
          used: (estimate.usage / 1024 / 1024).toFixed(2) + ' MB',
          quota: (estimate.quota / 1024 / 1024).toFixed(2) + ' MB',
          percentage: ((estimate.usage / estimate.quota) * 100).toFixed(2) + '%'
        });
      });
    }
  }

  console.log('✅ PWA initialized');

})();
