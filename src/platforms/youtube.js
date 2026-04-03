/**
 * platforms/youtube.js : Stratégie YouTube Shorts
 *
 * YouTube Shorts utilise un conteneur scrollable vertical (#shorts-container)
 * avec scroll-snap. Les vidéos bouclent (loop=true), donc on détecte la fin
 * d'un cycle via timeupdate (usesLoop: true).
 */

(() => {
  "use strict";

  if (!window.__autoScrollPlatforms) {
    window.__autoScrollPlatforms = {};
  }

  window.__autoScrollPlatforms.youtube = {
    name: "YouTube Shorts",
    usesLoop: true,

    /**
     * Récupère l'élément <video> actuellement visible dans le flux Shorts.
     * YouTube ne rend qu'un seul ytd-reel-video-renderer à la fois.
     */
    getActiveVideo() {
      return document.querySelector("ytd-reel-video-renderer video");
    },

    /**
     * Scroll vers le short suivant.
     */
    scrollToNext() {
      // Méthode 1 : cliquer sur le bouton "suivant"
      const nextButton = document.querySelector("#navigation-button-down button");
      if (nextButton) {
        nextButton.click();
        return;
      }

      // Méthode 2 : scroll direct dans le conteneur snap
      const container = document.querySelector("#shorts-container");
      if (container) {
        const item = document.querySelector(".reel-video-in-sequence-new");
        const snapHeight = item ? item.getBoundingClientRect().height : window.innerHeight;
        container.scrollTop += snapHeight;
      }
    },
  };
})();
