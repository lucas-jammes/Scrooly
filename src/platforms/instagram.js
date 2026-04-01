/**
 * platforms/instagram.js : Stratégie Instagram Reels
 *
 * Instagram Reels boucle les vidéos automatiquement.
 * Détection de fin de cycle via timeupdate (usesLoop: true).
 * Navigation : scroll vers le bas dans le conteneur de Reels.
 */

(() => {
  "use strict";

  if (!window.__autoScrollPlatforms) {
    window.__autoScrollPlatforms = {};
  }

  window.__autoScrollPlatforms.instagram = {
    name: "Instagram Reels",
    usesLoop: true,

    /**
     * Récupère la vidéo Instagram Reel active.
     * Instagram utilise des <video> dans des conteneurs de reel.
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

      // Fallback
      for (const video of videos) {
        if (!video.paused) return video;
      }

      return null;
    },

    /**
     * Scroll vers le Reel suivant.
     * Instagram Reels utilise un feed scroll-snap vertical.
     */
    scrollToNext() {
      // Méthode 1 : touche flèche bas
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowDown",
          code: "ArrowDown",
          keyCode: 40,
          bubbles: true,
        })
      );

      // Méthode 2 (fallback) : scroll natif
      setTimeout(() => {
        const reelsContainer =
          document.querySelector("section main > div > div") ||
          document.scrollingElement;

        if (reelsContainer) {
          reelsContainer.scrollBy({
            top: window.innerHeight,
            behavior: "smooth",
          });
        }
      }, 200);
    },
  };
})();
