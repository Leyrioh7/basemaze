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
      // CRITICAL: Only call ready() if it's the REAL SDK, not the stub
      var isRealSDK = window.farcasterSDK && !window.farcasterSDK.isStub && window.farcasterSDK.loaded;
      
      if (isRealSDK && window.farcasterSDK?.actions?.ready && !readyCalled && !window.farcasterSDK.readySent) {
        logReady('REAL SDK ready function found, calling ready()...', 'success');
        window.farcasterSDK.actions.ready();
        window.farcasterSDK.readySent = true;
        readyCalled = true;
        logReady('READY sent from ready.js (REAL SDK)', 'success');
      } else if (window.farcasterSDK?.isStub && !readyCalled) {
        // Stub is loaded but real SDK isn't - mark that we want to call ready() when real SDK loads
        logReady('Stub SDK found, marking for ready() call when real SDK loads...', 'info');
        window.farcasterSDK._stubReadyCalled = true;
        readyCalled = true; // Prevent multiple calls
        // Keep checking for real SDK
        setTimeout(checkSDK, 100);
      } else if (!readyCalled) {
        if (!window.farcasterSDK) {
          logReady('SDK not found yet, retrying...', 'info');
        } else if (!window.farcasterSDK.loaded) {
          logReady('SDK found but not loaded yet (isStub: ' + (window.farcasterSDK.isStub || false) + '), retrying...', 'info');
        } else if (!window.farcasterSDK.actions?.ready) {
          logReady('SDK found but ready() not available, retrying...', 'warning');
        } else if (window.farcasterSDK.readySent) {
          logReady('Ready already sent, stopping check', 'info');
          readyCalled = true;
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
  
  // Critical fallback: Call ready() after 3 seconds max to prevent blue screen
  setTimeout(() => {
    // Only call if it's the REAL SDK
    var isRealSDK = window.farcasterSDK && !window.farcasterSDK.isStub && window.farcasterSDK.loaded;
    
    if (!readyCalled && isRealSDK && window.farcasterSDK?.actions?.ready && !window.farcasterSDK.readySent) {
      try {
        logReady('TIMEOUT: Calling REAL SDK ready() to prevent blue screen!', 'warning');
        window.farcasterSDK.actions.ready();
        window.farcasterSDK.readySent = true;
        readyCalled = true;
        logReady('READY sent from ready.js (timeout fallback - REAL SDK)', 'success');
      } catch (e) {
        logReady('Error in timeout fallback ready(): ' + e.message, 'error');
        console.error("Error in timeout fallback ready():", e);
      }
    } else if (!readyCalled) {
      logReady('Farcaster SDK not available after timeout - blue screen may appear', 'error');
      logReady('SDK object exists: ' + (window.farcasterSDK ? 'yes' : 'no'), 'error');
      logReady('SDK loaded: ' + (window.farcasterSDK?.loaded ? 'yes' : 'no'), 'error');
      logReady('SDK is stub: ' + (window.farcasterSDK?.isStub ? 'yes' : 'no'), 'error');
      logReady('SDK has ready: ' + (window.farcasterSDK?.actions?.ready ? 'yes' : 'no'), 'error');
      logReady('Ready sent: ' + (window.farcasterSDK?.readySent ? 'yes' : 'no'), 'error');
    }
  }, 3000);
});