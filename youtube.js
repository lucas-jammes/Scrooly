/**
 * platforms/youtube.js : Stratégie YouTube Shorts
 *
 * YouTube Shorts utilise un conteneur scrollable vertical.
 * Les vidéos ne bouclent PAS par défaut (elles se mettent en pause à la fin).
 * On écoute l'événement "ended" sur le <video> actif.
 * Pour passer à la suivante : scroll vers le bas dans le conteneur de shorts.
 */

(() => {
  "use strict";

  if (!window.__autoScrollPlatforms) {
    window.__autoScrollPlatforms = {};
  }

  window.__autoScrollPlatforms.youtube = {
    name: "YouTube Shorts",
    usesLoop: false,

    /**
     * Récupère l'élément <video> actuellement visible dans le flux Shorts.
     * YouTube rend plusieurs shorts dans le DOM ; on cible celui qui est
     * dans le viewport (le conteneur "shorts" actif).
     */
    getActiveVideo() {
      // Sélecteur du player vidéo dans un short visible
      const shorts = document.querySelectorAll("ytd-reel-video-renderer");

      for (const short of shorts) {
        const rect = short.getBoundingClientRect();
        // Le short actif est celui dont le centre est visible dans le viewport
        const centerY = rect.top + rect.height / 2;
        if (centerY > 0 && centerY < window.innerHeight) {
          return short.querySelector("video");
        }
      }

      // Fallback : premier video trouvé dans la page shorts
      return document.querySelector("ytd-shorts video");
    },

    /**
     * Scroll vers le short suivant.
     * YouTube Shorts utilise un conteneur avec scroll-snap.
     */
    scrollToNext() {
      // Méthode 1 : cliquer sur le bouton "suivant" si disponible
      const nextButton = document.querySelector(
        "button.ytd-shorts [aria-label*='Next']," +
        "button.ytd-shorts [aria-label*='Suivant']," +
        "#navigation-button-down button"
      );

      if (nextButton) {
        nextButton.click();
        return;
      }

      // Méthode 2 : simuler un appui sur la touche flèche bas
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowDown",
          code: "ArrowDown",
          keyCode: 40,
          bubbles: true,
        })
      );
    },
  };
})();
