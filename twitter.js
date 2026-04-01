/**
 * platforms/twitter.js : Stratégie X (Twitter)
 *
 * X n'a pas de vrai format "shorts" vertical, mais les vidéos dans le feed
 * peuvent être scrollées automatiquement. Les vidéos bouclent.
 * On cible spécifiquement les vidéos dans le feed principal.
 */

(() => {
  "use strict";

  if (!window.__autoScrollPlatforms) {
    window.__autoScrollPlatforms = {};
  }

  window.__autoScrollPlatforms.twitter = {
    name: "X (Twitter)",
    usesLoop: true,

    /**
     * Récupère la vidéo X actuellement visible et en lecture.
     */
    getActiveVideo() {
      const videos = document.querySelectorAll("video");

      for (const video of videos) {
        if (!video.paused && video.readyState >= 2) {
          const rect = video.getBoundingClientRect();
          const centerY = rect.top + rect.height / 2;
          // Vidéo visible dans la moitié centrale du viewport
          if (centerY > window.innerHeight * 0.2 && centerY < window.innerHeight * 0.8) {
            return video;
          }
        }
      }

      return null;
    },

    /**
     * Scroll vers le post/vidéo suivant dans le feed.
     * X ne supporte pas les raccourcis clavier de la même façon ;
     * on utilise un scroll natif pour avancer dans le feed.
     */
    scrollToNext() {
      // Trouver le tweet contenant la vidéo active pour calculer la distance
      const video = this.getActiveVideo();

      if (video) {
        // Remonter jusqu'à l'article (tweet) parent
        const article = video.closest("article");
        if (article) {
          const rect = article.getBoundingClientRect();
          // Scroll juste assez pour dépasser ce tweet
          window.scrollBy({
            top: rect.bottom + 20,
            behavior: "smooth",
          });
          return;
        }
      }

      // Fallback : scroll d'un écran
      window.scrollBy({
        top: window.innerHeight * 0.8,
        behavior: "smooth",
      });
    },
  };
})();
