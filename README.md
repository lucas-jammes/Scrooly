# AutoScroll Videos

Chrome extension that automatically scrolls to the next video when the current one ends.  
Works on YouTube Shorts, TikTok, Instagram Reels, Snapchat Spotlight, and X.

## Installation

1. Download or clone this repo:

```bash
git clone https://github.com/lucas-jammes/auto-scroll-extension.git
```

2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top right corner)
4. Click **Load unpacked**
5. Select the `auto-scroll-extension` folder

The icon appears in the extensions bar. Click it to open the control popup.

## Usage

The extension works on its own once enabled. When a video ends, it scrolls to the next one. The popup lets you toggle the behavior on or off at any time, and highlights which supported platform you're currently on.

How it behaves depending on the platform:

- **YouTube Shorts**: detects the native end-of-video event and moves to the next short.
- **TikTok / Instagram Reels / Snapchat Spotlight**: these platforms loop videos by default. The extension detects the end of the first playback cycle, then scrolls.
- **X (Twitter)**: scrolls to the next post once the current video completes a full loop.

## Project structure

```
auto-scroll-extension/
├── manifest.json            Manifest V3
├── background.js            Service worker (global state, messaging)
├── content.js               Main router (platform detection, video monitoring)
├── popup.html / .css / .js  User interface
├── platforms/
│   ├── youtube.js           YouTube Shorts strategy
│   ├── tiktok.js            TikTok strategy
│   ├── instagram.js         Instagram Reels strategy
│   ├── snapchat.js          Snapchat Spotlight strategy
│   └── twitter.js           X / Twitter strategy
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

Each file in `platforms/` is self-contained and defines three things: how to find the active video, how to scroll to the next one, and whether the platform loops videos. This modular architecture makes it easy to add a new platform or fix a broken selector without touching the rest of the codebase.

## Known limitations

- These platforms regularly update their DOM. If scrolling stops working on a given site, the CSS selector in the matching `platforms/` file likely needs updating.
- On X, there is no true vertical shorts feed; the scroll advances through the regular timeline, which can feel less smooth than on other platforms.
- The extension only works on the web version of each platform (not mobile apps or PWAs).
