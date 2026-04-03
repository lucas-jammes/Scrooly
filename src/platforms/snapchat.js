/**
 * platforms/snapchat.js : Stratégie Snapchat Spotlight
 *
 * Snapchat Spotlight (web) affiche UNE vidéo à la fois avec navigation
 * par boutons (haut/bas). Pas de conteneur scrollable.
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
      // Une seule vidéo affichée à la fois sur Spotlight
      const video = document.querySelector("video");
      if (video && !video.paused && video.readyState >= 2) {
        return video;
      }
      return video || null;
    },

    /**
     * Passe au Spotlight suivant via le bouton de navigation "bas".
     * Snapchat utilise deux boutons (haut/bas) dans un conteneur de nav.
     */
    scrollToNext() {
      // Bloquer le scroll de la page pendant la navigation
      const scrollTop = document.documentElement.scrollTop;
      const lockScroll = () => { document.documentElement.scrollTop = scrollTop; };
      window.addEventListener("scroll", lockScroll);
      setTimeout(() => window.removeEventListener("scroll", lockScroll), 1000);

      // Méthode 1 : cliquer sur le bouton "suivant" (2ème bouton dans le conteneur nav)
      const navButtons = document.querySelectorAll(
        '[class*="SpotlightNavButtons_navButtonsContainer"] button'
      );
      const downButton = navButtons[1];
      if (downButton && !downButton.className.includes("Disabled")) {
        downButton.click();
        return;
      }

      // Méthode 2 : chercher n'importe quel bouton nav non-disabled
      const allNavBtns = document.querySelectorAll(
        '[class*="SpotlightFeedNavButtonV2_navButton"]'
      );
      for (const btn of allNavBtns) {
        if (!btn.className.includes("Disabled") && !btn.className.includes("Up")) {
          btn.click();
          return;
        }
      }

      // Méthode 3 (fallback) : cliquer sur le premier lien vers un autre spotlight
      const nextLink = document.querySelector(
        '[class*="FeedV2"] a[href*="/spotlight/"]'
      );
      if (nextLink) {
        nextLink.click();
      }
    },
  };
})();
