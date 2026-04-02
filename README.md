# Lotus V.2 — คุณคือบัวอะไร

## Folder Structure (Production-Ready)

```
lotus-2/
├── index.html              ← Entry point
└── assets/
    ├── Texture.jpg             ← Background texture (applied globally)
    ├── back-card.png           ← Static card for landing page
    ├── royal-pink.png
    ├── radiant-gomen.png
    ├── midnight-bloom.png
    ├── mystic-azure.png
    ├── eternal-petal.png
    ├── golden-wisdom.png
    ├── font/
    │   ├── Charmonman-Bold.ttf
    │   ├── BaiJamjuree-Regular.ttf
    │   └── kaliebluxury-regular.ttf
    └── sharing-cards/
        ├── royal-pink-share.png
        ├── radiant-gomen-share.png
        ├── midnight-bloom-share.png
        ├── mystic-azure-share.png
        ├── eternal-petal-share.png
        └── golden-wisdom-share.png
```

## Changelog — V.2 Refactor

### 1. Infrastructure & Folder Organization
- ✅ Fixed broken `{assets,css,js}` folder — now proper `/assets` directory
- ✅ Clean separation: `/assets`, `/css`, `/js` — production-ready
- ✅ `assets/Texture.jpg` set as global `background-image` via CSS `background-attachment: fixed`

### 2. Landing Page & Global UI
- ✅ All buttons use `border-radius: 4px` (`--radius-btn: 4px`)
- ✅ Loader / Lotus Icon.svg spinner completely removed
- ✅ SVG fallback card renders inline when `landing-card.png` is absent

### 3. Prediction Page — Redesigned Layout
- ✅ **New layout** matches design mockup:
  - Large English title (`The Mystic Azure`) — Cormorant Garamond italic, left-aligned
  - Full-width botanical PNG image with drop shadow
  - Thai lotus name centered below in Cormorant Garamond
  - Description body copy in Sarabun
- ✅ Button labels: `บันทึกรูป` + `ลองอีกครั้ง`
- ✅ Smooth staggered fade+slide animation (replaces card-flip); each element enters with a delay offset

### 4. Core Logic & Functionality
- ✅ **Randomization**: Uses `crypto.getRandomValues()` (cryptographically strong); falls back to `Math.random()`
- ✅ **Retry avoidance**: `retryPrediction()` tries up to 10 times to avoid showing the same lotus twice in a row
- ✅ **Save image**: Downloads `*-share.png` that exactly matches the current result
  - Canvas draw → `toDataURL` (same-origin, no CORS)
  - Falls back to direct `<a href download>` if canvas fails

### 5. Data Mapping

| id             | enTitle            | Thai Name      | Share File                                      |
|----------------|--------------------|----------------|-------------------------------------------------|
| royal-pink     | The Royal Pink     | ดอกบัวปทุมชาติ | sharing-cards/royal-pink-share.png              |
| radiant-gomen  | The Radiant Gomen  | ดอกบัวโกเมน    | sharing-cards/radiant-gomen-share.png           |
| midnight-bloom | The Midnight Bloom | ดอกบัวเศวตอุบล | sharing-cards/midnight-bloom-share.png          |
| mystic-azure   | The Mystic Azure   | ดอกบัวฉลองขวัญ | sharing-cards/mystic-azure-share.png            |
| eternal-petal  | The Eternal Petal  | ดอกบัวจงกลนี   | sharing-cards/eternal-petal-share.png           |
| golden-wisdom  | The Golden Wisdom  | ดอกบัวมณีสยาม  | sharing-cards/golden-wisdom-share.png           |

## Deploy Notes
- No build step required — pure HTML/CSS/JS
- Ensure all assets are present in `/assets/`
- Works on any static host: Vercel, Netlify, GitHub Pages, etc.
- For save-image canvas to work without CORS errors, serve from same origin
