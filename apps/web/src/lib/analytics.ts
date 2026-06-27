import ReactGA from "react-ga4";

// Note: Vercel Analytics is initialized in main.tsx using inject() from @vercel/analytics

// Inject Microsoft Clarity Script tag
function injectClarity(projectId: string) {
  if (typeof window === "undefined" || document.getElementById("clarity-script")) return;
  
  const script = document.createElement("script");
  script.id = "clarity-script";
  script.type = "text/javascript";
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${projectId}`;
  
  const inlineScript = document.createElement("script");
  inlineScript.type = "text/javascript";
  inlineScript.innerHTML = `
    window.clarity = window.clarity || function() { (window.clarity.q = window.clarity.q || []).push(arguments) };
  `;
  
  document.head.appendChild(inlineScript);
  document.head.appendChild(script);
}

export const analytics = {
  init: () => {
    // Initialize Google Analytics (Replace with actual measurement ID in production env)
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-DEMO123456";
    try {
      ReactGA.initialize(gaId);
      console.log(`[Analytics] Google Analytics initialized with ID: ${gaId}`);
    } catch (e) {
      console.warn("Failed to initialize Google Analytics:", e);
    }

    // Initialize Microsoft Clarity
    const clarityId = import.meta.env.VITE_CLARITY_PROJECT_ID || "clarity_demo";
    try {
      injectClarity(clarityId);
      console.log(`[Analytics] Microsoft Clarity initialized with ID: ${clarityId}`);
    } catch (e) {
      console.warn("Failed to initialize Microsoft Clarity:", e);
    }
  },

  trackEvent: (eventName: string, params: Record<string, any> = {}) => {
    // Log locally in development
    console.log(`[Analytics Event] ${eventName}`, params);

    // Track in Google Analytics
    try {
      ReactGA.event({
        category: "SkillStake",
        action: eventName,
        ...params
      });
    } catch (e) {
      // Graceful fail in case of blockers
    }

    // Track in Microsoft Clarity
    try {
      if ((window as any).clarity) {
        (window as any).clarity("event", eventName, params);
      }
    } catch (e) {
      // Graceful fail
    }
  }
};
