// ==========================================
// PRIVACY & SECURITY PROTECTION SCRIPT
// ==========================================

(function() {
  'use strict';

  // 1. DISABLE RIGHT CLICK
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    showWarning();
    return false;
  });

  // 2. DISABLE F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (DevTools shortcuts)
  document.addEventListener('keydown', function(e) {
    // F12
    if (e.keyCode === 123) {
      e.preventDefault();
      showWarning();
      return false;
    }
    // Ctrl+Shift+I (Inspect)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
      e.preventDefault();
      showWarning();
      return false;
    }
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
      e.preventDefault();
      showWarning();
      return false;
    }
    // Ctrl+Shift+C (Inspect Element)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
      e.preventDefault();
      showWarning();
      return false;
    }
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.keyCode === 85) {
      e.preventDefault();
      showWarning();
      return false;
    }
    // Ctrl+S (Save Page)
    if (e.ctrlKey && e.keyCode === 83) {
      e.preventDefault();
      showWarning();
      return false;
    }
  });

  // 3. DETECT DevTools OPEN (checks console)
  let devtoolsOpen = false;
  const threshold = 160;
  
  setInterval(function() {
    if (window.outerWidth - window.innerWidth > threshold || 
        window.outerHeight - window.innerHeight > threshold) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        // Redirect or blur content
        document.body.style.filter = 'blur(10px)';
        showPersistentWarning();
      }
    } else {
      if (devtoolsOpen) {
        devtoolsOpen = false;
        document.body.style.filter = 'none';
        hideWarning();
      }
    }
  }, 500);

  // 4. DISABLE TEXT SELECTION & COPY
  document.addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
  });

  document.addEventListener('copy', function(e) {
    e.preventDefault();
    return false;
  });

  // 5. DISABLE DRAG & DROP
  document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
  });

  // 6. CONSOLE PROTECTION - Override console methods
  const disableConsole = function() {
    const noop = function() {};
    const methods = ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace', 'dir', 'dirxml', 'group', 'groupCollapsed', 'groupEnd', 'clear', 'count', 'countReset', 'assert', 'profile', 'profileEnd', 'time', 'timeLog', 'timeEnd', 'timeStamp', 'context', 'memory'];
    
    for (let i = 0; i < methods.length; i++) {
      window.console[methods[i]] = noop;
    }
  };
  
  // Optional: Uncomment to disable console completely
  // disableConsole();

  // 7. DETECT DEBUGGER
  setInterval(function() {
    debugger; // This will pause if DevTools is open
  }, 100);

  // 8. WATERMARK/FINGERPRINT (Hidden tracking)
  function addFingerprint() {
    const fingerprint = document.createElement('div');
    fingerprint.id = 'fp-' + Date.now();
    fingerprint.style.display = 'none';
    fingerprint.setAttribute('data-visitor', btoa(navigator.userAgent + Date.now()));
    document.body.appendChild(fingerprint);
  }
  addFingerprint();

  // 9. WARNING MESSAGE DISPLAY
  function showWarning() {
    let warning = document.getElementById('security-warning');
    if (!warning) {
      warning = document.createElement('div');
      warning.id = 'security-warning';
      warning.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 46, 62, 0.95);
        color: #fff;
        padding: 30px 40px;
        border-radius: 10px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 16px;
        z-index: 99999;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        border: 2px solid #fff;
      `;
      warning.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 10px;">⚠️ SECURITY WARNING</div>
        <div>Right-click and developer tools are disabled.</div>
        <div style="margin-top: 10px; font-size: 12px; opacity: 0.8;">This content is protected.</div>
      `;
      document.body.appendChild(warning);
      
      setTimeout(() => {
        if (warning && warning.parentNode) {
          warning.parentNode.removeChild(warning);
        }
      }, 2000);
    }
  }

  function showPersistentWarning() {
    let warning = document.getElementById('devtools-warning');
    if (!warning) {
      warning = document.createElement('div');
      warning.id = 'devtools-warning';
      warning.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(11, 13, 16, 0.98);
        color: #ff2e3e;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Anton', sans-serif;
        font-size: 48px;
        z-index: 999999;
        text-align: center;
        flex-direction: column;
      `;
      warning.innerHTML = `
        <div style="font-size: 72px; margin-bottom: 20px;">🚫</div>
        <div>DEVELOPER TOOLS DETECTED</div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 14px; margin-top: 20px; color: #00e5ff;">
          Please close DevTools to continue.
        </div>
      `;
      document.body.appendChild(warning);
    }
  }

  function hideWarning() {
    const warning = document.getElementById('devtools-warning');
    if (warning && warning.parentNode) {
      warning.parentNode.removeChild(warning);
    }
  }

  // 10. OBFUSCATE EMAILS IN DOM
  function obfuscateEmails() {
    const emails = document.querySelectorAll('[href^="mailto:"]');
    emails.forEach(function(email) {
      const original = email.getAttribute('href');
      email.removeAttribute('href');
      email.style.cursor = 'pointer';
      email.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = original;
      });
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', obfuscateEmails);
  } else {
    obfuscateEmails();
  }

  // 11. DISABLE PRINTING
  window.addEventListener('beforeprint', function(e) {
    e.preventDefault();
    showWarning();
    return false;
  });

  // 12. CLEAR CONSOLE PERIODICALLY
  setInterval(function() {
    console.clear();
  }, 2000);

  // 13. ANTI-IFRAME PROTECTION
  if (window.top !== window.self) {
    window.top.location = window.self.location;
  }

  // 14. MONITOR DOM CHANGES (Detect inspection)
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes') {
        // Someone is inspecting and modifying elements
        console.clear();
      }
    });
  });

  observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true
  });

  console.log('%c🚫 STOP!', 'color: #ff2e3e; font-size: 72px; font-weight: bold; text-shadow: 3px 3px 0 #000;');
  console.log('%cThis is a browser feature intended for developers.', 'color: #00e5ff; font-size: 18px;');
  console.log('%cIf someone told you to copy/paste something here, it is a SCAM.', 'color: #fff; font-size: 16px;');
  console.log('%c⚠️ Unauthorized access may be logged.', 'color: #ffd400; font-size: 14px; font-weight: bold;');

})();
