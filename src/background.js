/**
 * background.js : Scrooly v1.0.3
 *
 * Initializes default state on first install.
 * No master toggle ; only per-platform states.
 */

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["scrollCount"], (result) => {
    const defaults = {
      platforms: {
        youtube: true,
        tiktok: true,
        instagram: true,
        snapchat: true,
        twitter: true,
      },
    };

    // Preserve existing scrollCount across updates
    if (result.scrollCount === undefined) {
      defaults.scrollCount = 0;
    }

    chrome.storage.sync.set(defaults, () => {
      console.log("[Scrooly] Installed, all platforms enabled.");
    });
  });
});
