/**
 * platforms/snapchat.js : Stratégie Snapchat Spotlight
 *
 * Snapchat Spotlight (web) utilise un feed vertical de vidéos en boucle.
 * Détection de fin via timeupdate (usesLoop: true).
 */

(() => {
  "use strict";

  if (!window.__autoScrollPlatforms) {
    window.__autoScrollPlatforms = {};
  }

  window.__autoScrollPlatforms.snapchat = {
    name: "Snapchat Spotlight",
    usesLoop: true,

    /**
     * Récupère la vidéo Spotlight active.
     */
    getActiveVideo() {
      const videos = document.querySelectorAll("video");

      for (const video of videos) {
        if (!video.paused && video.readyState >= 2) {
          const rect = video.getBoundingClientRect();
          const centerY = rect.top + rect.height / 2;
          if (centerY > 0 && centerY < window.innerHeight) {
            return video;
          }
        }
      }

      for (const video of videos) {
        if (!video.paused) return video;
      }

      return null;
    },

    /**
     * Passe au Spotlight suivant.
     */
    scrollToNext() {
      // Méthode 1 : flèche bas
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowDown",
          code: "ArrowDown",
          keyCode: 40,
          bubbles: true,
        })
      );

      // Méthode 2 : scroll natif
      setTimeout(() => {
        const container = document.scrollingElement || document.documentElement;
        container.scrollBy({
          top: window.innerHeight,
          behavior: "smooth",
        });
      }, 200);
    },
  };
})();
