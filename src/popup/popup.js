/**
 * popup.js : Logique du popup
 *
 * - Gère le toggle ON/OFF
 * - Met en surbrillance la plateforme de l'onglet actif
 */

document.addEventListener("DOMContentLoaded", () => {
  const toggleSwitch = document.getElementById("toggleSwitch");
  const statusText = document.getElementById("statusText");

  // Mapping hostname -> clé de plateforme
  const platformMap = {
    "www.youtube.com": "youtube",
    "www.tiktok.com": "tiktok",
    "www.instagram.com": "instagram",
    "www.snapchat.com": "snapchat",
    "x.com": "twitter",
    "twitter.com": "twitter",
  };

  // Récupérer l'état initial
  chrome.runtime.sendMessage({ type: "GET_STATE" }, (response) => {
    if (chrome.runtime.lastError) return;

    const enabled = response?.enabled !== false;
    toggleSwitch.checked = enabled;
    updateStatusText(enabled);
  });

  // Mettre en surbrillance la plateforme de l'onglet actif
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]?.url) return;

    try {
      const url = new URL(tabs[0].url);
      const platform = platformMap[url.hostname];

      if (platform) {
        const chip = document.querySelector(`.platform-chip[data-platform="${platform}"]`);
        if (chip) chip.classList.add("active");
      }
    } catch {
      // URL invalide ; on ignore
    }
  });

  // Gérer le toggle
  toggleSwitch.addEventListener("change", () => {
    const enabled = toggleSwitch.checked;
    updateStatusText(enabled);

    chrome.runtime.sendMessage({
      type: "TOGGLE_STATE",
      enabled: enabled,
    });
  });

  /**
   * Met à jour le texte de statut.
   * @param {boolean} enabled
   */
  function updateStatusText(enabled) {
    statusText.textContent = enabled ? "Activé" : "Désactivé";
    statusText.classList.toggle("disabled", !enabled);
  }
});
