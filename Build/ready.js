// ready.js
window.addEventListener("DOMContentLoaded", () => {
  var readyCalled = false;
  
  // Wait for SDK to load (ES modules load asynchronously)
  const checkSDK = () => {
    try {
      if (window.farcasterSDK?.actions?.ready && !readyCalled) {
        window.farcasterSDK.actions.ready();
        window.farcasterSDK.readySent = true;
        readyCalled = true;
        console.log("READY sent from ready.js");
      } else if (!readyCalled) {
        // Retry after a short delay if SDK not loaded yet
        setTimeout(checkSDK, 100);
      }
    } catch (e) {
      console.error("Error sending ready():", e);
    }
  };
  
  // Start checking immediately
  checkSDK();
  
  // Critical fallback: Call ready() after 2 seconds max to prevent blue screen
  setTimeout(() => {
    if (!readyCalled && window.farcasterSDK?.actions?.ready) {
      try {
        window.farcasterSDK.actions.ready();
        window.farcasterSDK.readySent = true;
        readyCalled = true;
        console.log("READY sent from ready.js (timeout fallback)");
      } catch (e) {
        console.error("Error in timeout fallback ready():", e);
      }
    } else if (!readyCalled) {
      console.warn("Farcaster SDK not available after 2 seconds - blue screen may appear");
    }
  }, 2000);
});
