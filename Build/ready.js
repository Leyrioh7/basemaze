// ready.js
window.addEventListener("DOMContentLoaded", () => {
  // Wait for SDK to load (ES modules load asynchronously)
  const checkSDK = () => {
    try {
      if (window.farcasterSDK?.actions?.ready) {
        window.farcasterSDK.actions.ready();
        console.log("READY sent from ready.js");
      } else {
        // Retry after a short delay if SDK not loaded yet
        setTimeout(checkSDK, 100);
      }
    } catch (e) {
      console.error("Error sending ready():", e);
    }
  };
  
  // Start checking immediately
  checkSDK();
  
  // Also set a timeout to stop retrying after 5 seconds
  setTimeout(() => {
    if (!window.farcasterSDK?.actions?.ready) {
      console.warn("Farcaster SDK not available after 5 seconds");
    }
  }, 5000);
});
