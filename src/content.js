/**
 * content.js : Scrooly v1.0.3
 *
 * No master toggle. Each platform has its own enabled/disabled state.
 * Increments scrollCount in chrome.storage on each auto-scroll.
 */

(() => {
  "use strict";

  const platforms = window.__autoScrollPlatforms || {};
  const hostname = window.location.hostname;

  function detectPlatformKey() {
    const path = window.location.pathname;

    if (hostname.includes("youtube.com") && path.includes("/shorts")) return "youtube";
    if (hostname.includes("tiktok.com")) return "tiktok";
    if (hostname.includes("instagram.com") && path.includes("/reels")) return "instagram";
    if (hostname.includes("snapchat.com") && path.includes("/spotlight")) return "snapchat";
    return null;
  }

  let platformStates = {
    youtube: true,
    tiktok: true,
    instagram: true,
    snapchat: true,
  };
  let activePlatformKey = null;
  let activePlatform = null;
  let watchInterval = null;
  let observer = null;

  function isActive() {
    return activePlatformKey && platformStates[activePlatformKey] !== false;
  }

  function startWatching() {
    stopWatching();
    if (!activePlatform || !isActive()) return;

    watchInterval = setInterval(() => {
      if (!isActive()) return;

      const video = activePlatform.getActiveVideo();
      if (!video || video.__scroolyBound) return;

      video.__scroolyBound = true;

      if (activePlatform.usesLoop) {
        let hasReachedEnd = false;

        const onTimeUpdate = () => {
          if (!isActive()) return;
          const progress = video.currentTime / video.duration;

          if (progress >= 0.95) hasReachedEnd = true;

          if (hasReachedEnd && progress < 0.1) {
            hasReachedEnd = false;
            video.removeEventListener("timeupdate", onTimeUpdate);
            video.__scroolyBound = false;
            triggerNext();
          }
        };

        video.addEventListener("timeupdate", onTimeUpdate);
      } else {
        const onEnded = () => {
          if (!isActive()) return;
          video.removeEventListener("ended", onEnded);
          video.__scroolyBound = false;
          triggerNext();
        };

        video.addEventListener("ended", onEnded);
      }
    }, 1000);
  }

  function triggerNext() {
    if (!activePlatform) return;

    console.log(`[Scrooly] Video ended on ${activePlatform.name}, scrolling to next.`);
    activePlatform.scrollToNext();
    incrementCounter();

    setTimeout(() => startWatching(), 1500);
  }

  /**
   * Increment the scroll counter in storage.
   * Lightweight : one read + one write per scroll event.
   */
  function incrementCounter() {
    if (!chrome?.storage?.sync) return;
    chrome.storage.sync.get(["scrollCount"], (result) => {
      if (chrome.runtime.lastError) return;
      const count = (result.scrollCount || 0) + 1;
      chrome.storage.sync.set({ scrollCount: count });
    });
  }

  function stopWatching() {
    if (watchInterval) {
      clearInterval(watchInterval);
      watchInterval = null;
    }
  }

  function updatePlatform() {
    activePlatformKey = detectPlatformKey();
    activePlatform = activePlatformKey ? (platforms[activePlatformKey] || null) : null;
  }

  function init() {
    updatePlatform();

    if (!activePlatform) {
      console.log("[Scrooly] Unsupported platform or irrelevant page.");
      return;
    }

    console.log(`[Scrooly] Platform detected: ${activePlatform.name}`);

    // Load platform states
    if (!chrome?.storage?.sync) {
      console.warn("[Scrooly] chrome.storage.sync unavailable.");
      return;
    }
    chrome.storage.sync.get(["platforms"], (result) => {
      if (chrome.runtime.lastError) return;
      platformStates = { ...platformStates, ...(result.platforms || {}) };
      if (isActive()) startWatching();
    });

    // Listen for toggle changes from popup
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === "STATE_CHANGED") {
        if (message.platforms) {
          platformStates = { ...platformStates, ...message.platforms };
        }
        if (isActive()) {
          startWatching();
        } else {
          stopWatching();
        }
      }
    });

    // SPA navigation
    let lastUrl = window.location.href;
    observer = new MutationObserver(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        updatePlatform();
        if (isActive()) {
          startWatching();
        } else {
          stopWatching();
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  init();
})();
