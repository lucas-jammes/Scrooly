# AutoScroll Videos

Extension Chrome qui passe automatiquement à la vidéo suivante quand celle en cours se termine. Fonctionne sur YouTube Shorts, TikTok, Instagram Reels, Snapchat Spotlight et X.

## Installation

1. Télécharger ou cloner ce repo :

```bash
git clone https://github.com/lucas-jammes/auto-scroll-extension.git
```

2. Ouvrir Chrome et aller sur `chrome://extensions/`
3. Activer le **Mode développeur** (toggle en haut à droite)
4. Cliquer **Charger l'extension non empaquetée**
5. Sélectionner le dossier `auto-scroll-extension`

L'icône apparaît dans la barre d'extensions. Un clic dessus ouvre le popup de contrôle.

## Utilisation

L'extension fonctionne toute seule une fois activée. Quand une vidéo se termine, elle scroll vers la suivante. Le popup permet d'activer ou désactiver le comportement à tout moment, et indique sur quelle plateforme vous vous trouvez.

Comportement selon la plateforme :

- **YouTube Shorts** : détecte la fin de la vidéo (événement natif) et passe au short suivant.
- **TikTok / Instagram Reels / Snapchat Spotlight** : ces plateformes bouclent les vidéos automatiquement. L'extension détecte la fin du premier cycle de lecture, puis scroll.
- **X (Twitter)** : scroll vers le post suivant quand la vidéo en cours a fait un tour complet.

## Structure du projet

```
auto-scroll-extension/
├── manifest.json          Manifest V3
├── background.js          Service worker (état global, communication)
├── content.js             Routeur principal (détection plateforme, surveillance vidéo)
├── popup.html / .css / .js   Interface utilisateur
├── platforms/
│   ├── youtube.js         Stratégie YouTube Shorts
│   ├── tiktok.js          Stratégie TikTok
│   ├── instagram.js       Stratégie Instagram Reels
│   ├── snapchat.js        Stratégie Snapchat Spotlight
│   └── twitter.js         Stratégie X / Twitter
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

Chaque fichier dans `platforms/` est indépendant et définit trois choses : comment trouver la vidéo active, comment passer à la suivante, et si la plateforme boucle les vidéos. Cette architecture modulaire permet d'ajouter une nouvelle plateforme ou de corriger un sélecteur cassé sans toucher au reste du code.

## Limites connues

- Les plateformes mettent régulièrement à jour leur DOM. Si le scroll ne fonctionne plus sur un site, le sélecteur CSS dans le fichier `platforms/` correspondant est probablement à mettre à jour.
- Sur X, le format n'est pas un vrai feed vertical de shorts ; le scroll avance dans le feed classique, ce qui peut donner un résultat moins fluide que sur les autres plateformes.
- L'extension ne fonctionne que sur la version web des plateformes (pas sur les apps mobiles ni les PWA).

## Licence

MIT
