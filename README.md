<p align="center">
  <a href="https://github.com/lucas-jammes/Scrooly">
    <img src="icons/icon128.png" alt="Scrooly Logo" width="75" height="75">
  </a>

  <h1 align="center">Scrooly</h1>

  <p align="center">
    <img src="https://img.shields.io/github/license/lucas-jammes/Scrooly" title="GPL-3.0 License">
    <img src="https://img.shields.io/github/stars/lucas-jammes/Scrooly" title="Stars">
    <img src="https://img.shields.io/github/last-commit/lucas-jammes/Scrooly" title="Last commit">
  </p>

  <p align="center">
    Chrome extension that automatically scrolls to the next short video when the current one ends.
  </p>
</p>

---

## 📥 Installation

No store listing required, install directly from source:

1. Clone or download this repo
   ```bash
   git clone https://github.com/lucas-jammes/Scrooly.git
   ```
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked** and select the `Scrooly` folder
5. Pin the extension from the puzzle icon in your toolbar

---

## 🎯 Supported Platforms

![FF0033](https://placeholdit.com/10x10/FF0033/FF0033 "FF0033") YouTube Shorts  
![00F2EA](https://placeholdit.com/10x10/00F2EA/00F2EA "00F2EA") TikTok  
![E1306C](https://placeholdit.com/10x10/E1306C/E1306C "E1306C") Instagram Reels  
![FFFC00](https://placeholdit.com/10x10/FFFC00/FFFC00 "FFFC00") Snapchat Spotlight  
![FFFFFF](https://placeholdit.com/10x10/FFFFFF/FFFFFF "FFFFFF") X (Twitter)

Each platform can be individually toggled on or off from the popup.  

---

## 🧩 How It Works

- Click the Scrooly icon to open the popup
- Each platform has its own colored toggle
- The platform you're currently on is highlighted ; others are dimmed
- A pulse indicator shows when Scrooly is actively watching a video
- The footer tracks how many videos have been auto-scrolled

No configuration needed. Open a supported site, watch a video, and Scrooly handles the rest.

---

## ⚠️ Known Limitations

- These platforms regularly update their DOM structure. If auto-scroll stops working on a site, the CSS selectors in the matching `src/platforms/` file may need updating.
- On X, the feed is not a true vertical shorts format ; scrolling advances through the regular timeline, which can feel less smooth.
- Only works on the web version of each platform (not mobile apps or PWAs).

---

## 🤝 Contributing

⭐ Star the repo if you find it useful!
💬 Got feedback or a bug to report? [Open an issue](https://github.com/lucas-jammes/Scrooly/issues)

---

## 📜 License

Licensed under **GNU General Public License v3.0** - [Learn more](https://www.gnu.org/licenses/gpl-3.0.en.html)
