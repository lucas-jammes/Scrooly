/**
 * platforms/instagram.js : Stratégie Instagram Reels
 *
 * Instagram Reels boucle les vidéos (loop=true).
 * On retire l'attribut loop pour que l'événement "ended" se déclenche.
 * Navigation : scrollIntoView() sur la vidéo suivante dans le DOM.
 */

(() => {
  "use strict";

  if (!window.__autoScrollPlatforms) {
    window.__autoScrollPlatforms = {};
  }

  window.__autoScrollPlatforms.instagram = {
    name: "Instagram Reels",
    usesLoop: false,

    /**
     * Récupère la vidéo Instagram Reel active (visible dans le viewport).
     * Retire aussi l'attribut loop pour que "ended" se déclenche.
     */
    getActiveVideo() {
      const videos = document.querySelectorAll("main video");

      for (const video of videos) {
        const rect = video.getBoundingClientRect();
        if (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= window.innerHeight &&
          rect.right <= window.innerWidth
        ) {
          // Retirer loop pour que l'événement "ended" se déclenche
          if (video.hasAttribute("loop")) {
            video.removeAttribute("loop");
          }
          return video;
        }
      }

      return null;
    },

    /**
     * Scroll vers le Reel suivant via scrollIntoView().
     */
    scrollToNext() {
      const videos = Array.from(document.querySelectorAll("main video"));

      // Trouver la vidéo actuellement visible
      const currentIndex = videos.findIndex((video) => {
        const rect = video.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= window.innerHeight &&
          rect.right <= window.innerWidth
        );
      });

      const nextVideo = videos[currentIndex + 1];
      if (nextVideo) {
        nextVideo.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    },
  };
})();
