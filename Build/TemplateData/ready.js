// TemplateData/ready.js
window.addEventListener("DOMContentLoaded", () => {
  try {
    if (typeof window.farcasterReady === "function") {
      window.farcasterReady();
      console.log("ready.js called window.farcasterReady()");
    } else if (window.farcasterSDK?.actions?.ready) {
      window.farcasterSDK.actions.ready();
      window.farcasterSDK.readySent = true;
      console.log("ready.js fallback: called SDK ready()");
    } else {
      console.warn("Farcaster ready not available yet");
    }
  } catch (e) {
    console.error("ready.js error:", e);
  }
});
