// ready.js
window.addEventListener("DOMContentLoaded", () => {
  try {
    if (window.farcasterSDK?.actions?.ready) {
      window.farcasterSDK.actions.ready();
      console.log("READY sent from ready.js");
    } else {
      console.warn("Farcaster SDK not available yet");
    }
  } catch (e) {
    console.error("Error sending ready():", e);
  }
});