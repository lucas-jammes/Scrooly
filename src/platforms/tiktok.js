/**
 * platforms/tiktok.js : Stratégie TikTok
 *
 * TikTok boucle les vidéos automatiquement.
 * On détecte la fin d'un cycle complet via timeupdate (usesLoop: true).
 * Pour passer à la suivante : scroll dans le conteneur principal ou KeyboardEvent.
 */

(() => {
  "use strict";

  if (!window.__autoScrollPlatforms) {
    window.__autoScrollPlatforms = {};
  }

  window.__autoScrollPlatforms.tiktok = {
    name: "TikTok",
    usesLoop: true,

    /**
     * Récupère la vidéo TikTok actuellement visible.
     * TikTok utilise un feed vertical avec plusieurs <video> dans le DOM.
     */
    getActiveVideo() {
      const videos = document.querySelectorAll("video");

      for (const video of videos) {
        // On cherche la vidéo qui n'est pas en pause et qui est visible
        if (!video.paused && video.readyState >= 2) {
          const rect = video.getBoundingClientRect();
          const centerY = rect.top + rect.height / 2;
          if (centerY > 0 && centerY < window.innerHeight) {
            return video;
          }
        }
      }

      // Fallback : première vidéo en lecture
      for (const video of videos) {
        if (!video.paused) return video;
      }

      return null;
    },

    /**
     * Passe à la vidéo suivante.
     * TikTok réagit bien à la touche flèche bas.
     */
    scrollToNext() {
      // Méthode 1 : KeyboardEvent flèche bas
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowDown",
          code: "ArrowDown",
          keyCode: 40,
          bubbles: true,
        })
      );

      // Méthode 2 (fallback) : scroll le conteneur principal
      setTimeout(() => {
        const container =
          document.querySelector("[data-e2e='recommend-list-item-container']")?.parentElement ||
          document.querySelector("#app") ||
          document.scrollingElement;

        if (container) {
          container.scrollBy({
            top: window.innerHeight,
            behavior: "smooth",
          });
        }
      }, 200);
    },
  };
})();
