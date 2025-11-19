// ready.js
window.addEventListener("DOMContentLoaded", () => {
  if (window.farcaster && window.farcaster.actions) {
    window.farcaster.actions.ready();
  } else {
    console.warn("Farcaster SDK not loaded yet");
  }
});
