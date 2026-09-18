import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { apiFetch } from "@workspace/api-client-react";

// Helper to generate a valid UUID
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Helper to track visitor online status and data
export function useTracking(sessionDetails?: { name?: string; email?: string }) {
  const [location] = useLocation();
  // Keep the session ID in React memory only.
  // It regenerates on a full page reload and survives SPA navigation.
  const sessionId = useRef<string | null>(null);

  useEffect(() => {
    if (!sessionId.current) {
      sessionId.current = generateUUID();
      // Attach to window so other components can access it without prop drilling.
      (window as any).visitorId = sessionId.current;
    }

    // Collect system information
    const getBrowserInfo = () => {
      const ua = navigator.userAgent;
      let browser = "Unknown";
      if (ua.includes("Chrome")) browser = "Chrome";
      else if (ua.includes("Firefox")) browser = "Firefox";
      else if (ua.includes("Safari") && !ua.includes("Chrome"))
        browser = "Safari";
      else if (ua.includes("Edge")) browser = "Edge";

      let os = "Unknown";
      if (ua.includes("Win")) os = "Windows";
      else if (ua.includes("Mac")) os = "MacOS";
      else if (ua.includes("Linux")) os = "Linux";
      else if (ua.includes("Android")) os = "Android";
      else if (ua.includes("like Mac")) os = "iOS";

      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          ua,
        );
      const device = isMobile ? "mobile" : "desktop";

      return { browser, os, device, userAgent: ua };
    };

    const trackPage = async () => {
      try {
        const info = getBrowserInfo();

        // We simulate location here, in a real app you'd use a GeoIP service on the backend
        const locationStr = "Unknown";

        await apiFetch(`${window.location.origin}/api/track`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: sessionId.current,
            page: (window as any).currentBookingStep || location,
            ...info,
            location: location,
            sessionData: {
              id: sessionId.current,
              name: sessionDetails?.name?.trim() || null,
              email: sessionDetails?.email?.trim() || null,
              timestamp: Date.now(),
            },
          }),
        });
      } catch (err) {
        console.error("Tracking error:", err);
      }
    };

    trackPage();

    // Setup ping interval to show "online" status more frequently for realtime step by step
    const interval = setInterval(trackPage, 2000); // Ping every 2s

    return () => clearInterval(interval);
  }, [location, sessionDetails?.name, sessionDetails?.email]);
}
