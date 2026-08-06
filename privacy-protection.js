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
    if (e.keyCode === 123) { e.preventDefault(); showWarning(); return false; }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) { e.preventDefault(); showWarning(); return false; }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) { e.preventDefault(); showWarning(); return false; }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 67) { e.preventDefault(); showWarning(); return false; }
    if (e.ctrlKey && e.keyCode === 85) { e.preventDefault(); showWarning(); return false; }
    if (e.ctrlKey && e.keyCode === 83) { e.preventDefault(); return false; }
  });

  // 3. DETECT DevTools OPEN (window size method — no debugger)
  let devtoolsOpen = false;
  const threshold = 160;
  setInterval(function() {
    const open = (window.outerWidth - window.innerWidth > threshold ||
                  window.outerHeight - window.innerHeight > threshold);
    if (open && !devtoolsOpen) {
      devtoolsOpen = true;
      document.body.style.filter = 'blur(10px)';
      showPersistentWarning();
    } else if (!open && devtoolsOpen) {
      devtoolsOpen = false;
      document.body.style.filter = 'none';
      hideWarning();
    }
  }, 1000);

  // 4. DISABLE TEXT SELECTION & COPY (desktop only)
  if (!('ontouchstart' in window)) {
    document.addEventListener('selectstart', function(e) { e.preventDefault(); return false; });
    document.addEventListener('copy', function(e) { e.preventDefault(); return false; });
  }

  // 5. DISABLE DRAG & DROP
  document.addEventListener('dragstart', function(e) { e.preventDefault(); return false; });

  // 6. OBFUSCATE EMAILS IN DOM
  function obfuscateEmails() {
    document.querySelectorAll('[href^="mailto:"]').forEach(function(email) {
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

  // 7. DISABLE PRINTING
  window.addEventListener('beforeprint', function(e) { e.preventDefault(); showWarning(); return false; });

  // 8. ANTI-IFRAME PROTECTION
  if (window.top !== window.self) { window.top.location = window.self.location; }

  // 9. WARNING MESSAGE DISPLAY
  function showWarning() {
    if (document.getElementById('security-warning')) return;
    const warning = document.createElement('div');
    warning.id = 'security-warning';
    warning.style.cssText = [
      'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%)',
      'background:rgba(255,46,62,0.95);color:#fff;padding:30px 40px',
      'border-radius:10px;font-family:JetBrains Mono,monospace;font-size:16px',
      'z-index:99999;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,.5)',
      'border:2px solid #fff;pointer-events:none'
    ].join(';');
    warning.innerHTML = '<div style="font-size:24px;margin-bottom:10px;">⚠️ SECURITY WARNING</div>'
      + '<div>Right-click and developer tools are disabled.</div>';
    document.body.appendChild(warning);
    setTimeout(function() { warning.remove(); }, 2000);
  }

  function showPersistentWarning() {
    if (document.getElementById('devtools-warning')) return;
    const warning = document.createElement('div');
    warning.id = 'devtools-warning';
    warning.style.cssText = [
      'position:fixed;top:0;left:0;width:100%;height:100%',
      'background:rgba(11,13,16,0.98);color:#ff2e3e',
      'display:flex;align-items:center;justify-content:center',
      'font-family:Anton,sans-serif;font-size:48px',
      'z-index:999999;text-align:center;flex-direction:column'
    ].join(';');
    warning.innerHTML = '<div style="font-size:72px;margin-bottom:20px;">🚫</div>'
      + '<div>DEVELOPER TOOLS DETECTED</div>'
      + '<div style="font-family:JetBrains Mono,monospace;font-size:14px;margin-top:20px;color:#00e5ff;">Please close DevTools to continue.</div>';
    document.body.appendChild(warning);
  }

  function hideWarning() {
    const w = document.getElementById('devtools-warning');
    if (w) w.remove();
  }

  // 10. CONSOLE MESSAGE
  setTimeout(function() {
    console.log('%c🚫 STOP!', 'color:#ff2e3e;font-size:48px;font-weight:bold;');
    console.log('%cThis is a browser feature for developers. Unauthorized access may be logged.', 'color:#00e5ff;font-size:14px;');
  }, 500);

})();
