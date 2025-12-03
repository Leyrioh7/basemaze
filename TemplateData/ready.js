// TemplateData/ready.js (or Build/ready.js)
// DO NOT auto-call ready() early — Unity is not loaded yet

window.farcasterReady = () => {
  try {
    if (window.farcasterSDK?.actions?.ready) {
      window.farcasterSDK.actions.ready();
      console.log("[Farcaster] ready() sent from farcasterReady()");
    } else {
      console.warn("[Farcaster] SDK not ready yet");
    }
  } catch (err) {
    console.error("Farcaster ready() error:", err);
  }
};

window.addEventListener("DOMContentLoaded", () => {
  console.log("ready.js loaded — waiting for Unity to finish...");
});
