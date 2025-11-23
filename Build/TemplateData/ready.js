// ready.js
window.addEventListener("DOMContentLoaded", () => {
  var readyCalled = false;
  
  // Helper function for debug logging (if available)
  function logReady(msg, type) {
    if (typeof addDebugLog === 'function') {
      addDebugLog('[ready.js] ' + msg, type || 'info');
    }
    if (type === 'error') {
      console.error('[ready.js]', msg);
    } else if (type === 'warning') {
      console.warn('[ready.js]', msg);
    } else {
      console.log('[ready.js]', msg);
    }
  }
  
  logReady('ready.js loaded, starting SDK check...', 'info');
  
  // Wait for SDK to load (ES modules load asynchronously)
  const checkSDK = () => {
    try {
      if (window.farcasterSDK?.actions?.ready && !readyCalled) {
        logReady('SDK ready function found, calling ready()...', 'success');
        window.farcasterSDK.actions.ready();
        window.farcasterSDK.readySent = true;
        readyCalled = true;
        logReady('READY sent from ready.js', 'success');
      } else if (!readyCalled) {
        if (!window.farcasterSDK) {
          logReady('SDK not found yet, retrying...', 'info');
        } else if (!window.farcasterSDK.actions?.ready) {
          logReady('SDK found but ready() not available, retrying...', 'warning');
        } else if (readyCalled) {
          logReady('Ready already called, stopping check', 'info');
        }
        // Retry after a short delay if SDK not loaded yet
        setTimeout(checkSDK, 100);
      }
    } catch (e) {
      logReady('Error sending ready(): ' + e.message, 'error');
      console.error("Error sending ready():", e);
    }
  };
  
  // Start checking immediately
  checkSDK();
  
  // Critical fallback: Call ready() after 2 seconds max to prevent blue screen
  setTimeout(() => {
    if (!readyCalled && window.farcasterSDK?.actions?.ready) {
      try {
        logReady('TIMEOUT: Calling ready() to prevent blue screen!', 'warning');
        window.farcasterSDK.actions.ready();
        window.farcasterSDK.readySent = true;
        readyCalled = true;
        logReady('READY sent from ready.js (timeout fallback)', 'success');
      } catch (e) {
        logReady('Error in timeout fallback ready(): ' + e.message, 'error');
        console.error("Error in timeout fallback ready():", e);
      }
    } else if (!readyCalled) {
      logReady('Farcaster SDK not available after 2 seconds - blue screen may appear', 'error');
      logReady('SDK object exists: ' + (window.farcasterSDK ? 'yes' : 'no'), 'error');
      logReady('SDK has ready: ' + (window.farcasterSDK?.actions?.ready ? 'yes' : 'no'), 'error');
    }
  }, 2000);
});