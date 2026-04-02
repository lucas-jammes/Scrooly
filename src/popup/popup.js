/**
 * popup.js : Scrooly v1.0.3
 *
 * Per-platform toggles only (no master toggle).
 * Pulse indicator on active platform.
 * Scroll counter from storage.
 * Dims non-active platforms when on a supported site.
 */

document.addEventListener("DOMContentLoaded", () => {
  const platformToggles = document.querySelectorAll(".platform-toggle");
  const scrollCountEl = document.getElementById("scrollCount");

  const platformMap = {
    "www.youtube.com": "youtube",
    "www.tiktok.com": "tiktok",
    "www.instagram.com": "instagram",
    "www.snapchat.com": "snapchat",
    "x.com": "twitter",
    "twitter.com": "twitter",
  };

  const defaultPlatforms = {
    youtube: true,
    tiktok: true,
    instagram: true,
    snapchat: true,
    twitter: true,
  };

  let currentPlatform = null;

  // ---- Load state ----

  if (!chrome?.storage?.sync) return;

  chrome.storage.sync.get(["platforms", "scrollCount"], (result) => {
    const platforms = { ...defaultPlatforms, ...(result.platforms || {}) };

    platformToggles.forEach((toggle) => {
      const key = toggle.dataset.key;
      toggle.checked = platforms[key] !== false;
      updateRowUI(toggle);
    });

    scrollCountEl.textContent = result.scrollCount || 0;
  });

  // ---- Detect current tab platform ----

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]?.url) return;

    try {
      const url = new URL(tabs[0].url);
      currentPlatform = platformMap[url.hostname] || null;
    } catch {
      currentPlatform = null;
    }

    applyActiveState();
  });

  /**
   * Highlight the current platform, dim the others, show pulse.
   * If user is not on any supported platform, nothing is dimmed.
   */
  function applyActiveState() {
    const rows = document.querySelectorAll(".platform-row");

    rows.forEach((row) => {
      const platform = row.dataset.platform;
      const pulse = row.querySelector(".platform-pulse");
      const isActive = platform === currentPlatform;
      const toggle = row.querySelector(".platform-toggle");

      row.classList.toggle("active", isActive);

      // Only dim if we ARE on a supported platform
      if (currentPlatform) {
        row.classList.toggle("dimmed", !isActive);
      } else {
        row.classList.remove("dimmed");
      }

      // Pulse : visible only on active platform with toggle ON
      if (isActive && toggle.checked) {
        pulse.classList.add("watching");
      } else {
        pulse.classList.remove("watching");
      }
    });
  }

  // ---- Platform toggles ----

  platformToggles.forEach((toggle) => {
    toggle.addEventListener("change", () => {
      updateRowUI(toggle);
      applyActiveState();
      savePlatforms();
      broadcastState();
    });
  });

  function updateRowUI(toggle) {
    const row = toggle.closest(".platform-row");
    row.classList.toggle("disabled", !toggle.checked);
  }

  function savePlatforms() {
    const platforms = {};
    platformToggles.forEach((toggle) => {
      platforms[toggle.dataset.key] = toggle.checked;
    });
    if (chrome?.storage?.sync) chrome.storage.sync.set({ platforms });
  }

  // ---- Broadcast to content scripts ----

  function broadcastState() {
    const platforms = {};
    platformToggles.forEach((toggle) => {
      platforms[toggle.dataset.key] = toggle.checked;
    });

    chrome.tabs.query({}, (tabs) => {
      for (const tab of tabs) {
        chrome.tabs.sendMessage(tab.id, {
          type: "STATE_CHANGED",
          platforms,
        }).catch(() => {});
      }
    });
  }
});
