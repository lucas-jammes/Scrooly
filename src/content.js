/**
 * content.js : Routeur principal
 *
 * Détecte la plateforme courante, charge la stratégie appropriée,
 * et orchestre la surveillance de la vidéo active.
 */

(() => {
  "use strict";

  // Registre des stratégies par plateforme (chaque fichier platforms/*.js s'enregistre ici)
  // window.__autoScrollPlatforms est peuplé par les fichiers chargés avant content.js
  const platforms = window.__autoScrollPlatforms || {};

  const hostname = window.location.hostname;

  /**
   * Identifie la plateforme active en fonction du hostname et du path.
   * @returns {object|null} La stratégie plateforme ou null si non supportée.
   */
  function detectPlatform() {
    const path = window.location.pathname;

    if (hostname.includes("youtube.com") && path.includes("/shorts")) {
      return platforms.youtube || null;
    }
    if (hostname.includes("tiktok.com")) {
      return platforms.tiktok || null;
    }
    if (hostname.includes("instagram.com") && path.includes("/reels")) {
      return platforms.instagram || null;
    }
    if (hostname.includes("snapchat.com") && path.includes("/spotlight")) {
      return platforms.snapchat || null;
    }
    if (hostname.includes("x.com") || hostname.includes("twitter.com")) {
      return platforms.twitter || null;
    }

    return null;
  }

  // État interne
  let isEnabled = true;
  let activePlatform = null;
  let observer = null;
  let watchInterval = null;

  /**
   * Surveille la vidéo active et déclenche le scroll à la fin.
   */
  function startWatching() {
    stopWatching();

    if (!activePlatform) return;

    // Intervalle de vérification : cherche la vidéo active et attache les listeners
    watchInterval = setInterval(() => {
      if (!isEnabled) return;

      const video = activePlatform.getActiveVideo();
      if (!video || video.__autoScrollBound) return;

      video.__autoScrollBound = true;

      if (activePlatform.usesLoop) {
        // Pour les plateformes qui bouclent (Insta, TikTok, Snap) :
        // on détecte la fin quand currentTime revient proche de 0 après avoir dépassé 90%
        let hasReachedEnd = false;

        const onTimeUpdate = () => {
          if (!isEnabled) return;

          const progress = video.currentTime / video.duration;

          if (progress >= 0.95) {
            hasReachedEnd = true;
          }

          if (hasReachedEnd && progress < 0.1) {
            // La vidéo a bouclé : on passe à la suivante
            hasReachedEnd = false;
            video.removeEventListener("timeupdate", onTimeUpdate);
            video.__autoScrollBound = false;
            triggerNext();
          }
        };

        video.addEventListener("timeupdate", onTimeUpdate);
      } else {
        // Pour les plateformes sans boucle (YouTube Shorts) : événement "ended"
        const onEnded = () => {
          if (!isEnabled) return;
          video.removeEventListener("ended", onEnded);
          video.__autoScrollBound = false;
          triggerNext();
        };

        video.addEventListener("ended", onEnded);
      }
    }, 1000);
  }

  /**
   * Déclenche le passage à la vidéo suivante.
   */
  function triggerNext() {
    if (!activePlatform) return;

    console.log(`[AutoScroll] Fin de vidéo détectée sur ${activePlatform.name}, passage à la suivante.`);
    activePlatform.scrollToNext();

    // Relancer la surveillance après un court délai (le DOM doit se mettre à jour)
    setTimeout(() => startWatching(), 1500);
  }

  /**
   * Arrête la surveillance.
   */
  function stopWatching() {
    if (watchInterval) {
      clearInterval(watchInterval);
      watchInterval = null;
    }
  }

  /**
   * Initialise l'extension sur la page courante.
   */
  function init() {
    activePlatform = detectPlatform();

    if (!activePlatform) {
      console.log("[AutoScroll] Plateforme non supportée ou page non pertinente.");
      return;
    }

    console.log(`[AutoScroll] Plateforme détectée : ${activePlatform.name}`);

    // Récupérer l'état initial
    chrome.runtime.sendMessage({ type: "GET_STATE" }, (response) => {
      if (chrome.runtime.lastError) return;
      isEnabled = response?.enabled !== false;
      if (isEnabled) startWatching();
    });

    // Écouter les changements d'état depuis le popup
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === "STATE_CHANGED") {
        isEnabled = message.enabled;
        if (isEnabled) {
          startWatching();
        } else {
          stopWatching();
        }
      }
    });

    // Observer les changements d'URL (SPA : YouTube, Instagram, etc.)
    let lastUrl = window.location.href;
    observer = new MutationObserver(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        activePlatform = detectPlatform();
        if (activePlatform && isEnabled) {
          startWatching();
        } else {
          stopWatching();
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Lancer l'initialisation
  init();
})();
