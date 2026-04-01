/**
 * background.js : Service Worker (Manifest V3)
 *
 * Responsabilités :
 * - Relayer les messages entre le popup et les content scripts
 * - Gérer l'état global (enabled/disabled) via chrome.storage
 */

// Initialiser l'état par défaut au premier install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ enabled: true }, () => {
    console.log("[AutoScroll] Extension installée, activée par défaut.");
  });
});

// Écouter les messages du popup pour relayer aux content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "TOGGLE_STATE") {
    chrome.storage.sync.set({ enabled: message.enabled }, () => {
      // Relayer le changement à tous les onglets actifs
      chrome.tabs.query({}, (tabs) => {
        for (const tab of tabs) {
          chrome.tabs.sendMessage(tab.id, {
            type: "STATE_CHANGED",
            enabled: message.enabled,
          }).catch(() => {
            // Onglet sans content script injecté ; on ignore silencieusement
          });
        }
      });
      sendResponse({ success: true });
    });
    return true; // Indique une réponse asynchrone
  }

  if (message.type === "GET_STATE") {
    chrome.storage.sync.get(["enabled"], (result) => {
      sendResponse({ enabled: result.enabled !== false });
    });
    return true;
  }
});
