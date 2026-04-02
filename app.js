/* ============================================================
   LOTUS V.2 — Main Application Logic
   Refactored per Design Spec v.2
   ============================================================ */

'use strict';

// ── Lotus Data ─────────────────────────────────────────────────
// Each entry has both an English display title and Thai name.
// shareImage must match the correct *-share.png file for download.
const LOTUS_DATA = [
  {
    id: 'royal-pink',
    enTitle: 'The Royal Pink',       // Large English heading on prediction page
    name: 'ดอกบัวปทุมชาติ',           // Thai name (decorative sub-heading)
    image: 'assets/royal-pink.png',
    shareImage: 'assets/royal-pink-share.png',
    description:
      'คุณมีจิตวิญญาณที่สง่างามและอ่อนโยน เปี่ยมด้วยความรักและความเมตตา ดั่งบัวปทุมชาติที่ผลิบานอย่างงดงาม คุณนำความอบอุ่นและความสุขมาสู่ผู้คนรอบข้างเสมอ',
  },
  {
    id: 'radiant-gomen',
    enTitle: 'The Radiant Gomen',
    name: 'ดอกบัวโกเมน',
    image: 'assets/radiant-gomen.png',
    shareImage: 'assets/radiant-gomen-share.png',
    description:
      'คุณเป็นผู้มีพลังและความมุ่งมั่นอันแรงกล้า สีแดงเข้มของบัวโกเมนสะท้อนถึงหัวใจที่กล้าหาญและเต็มเปี่ยมด้วยความหลงใหล คุณไม่เคยยอมแพ้ต่ออุปสรรคใดๆ',
  },
  {
    id: 'midnight-bloom',
    enTitle: 'The Midnight Bloom',
    name: 'ดอกบัวเศวตอุบล',
    image: 'assets/midnight-bloom.png',
    shareImage: 'assets/midnight-bloom-share.png',
    description:
      'คุณมีความลึกซึ้งและปัญญาที่น่าทึ่ง เหมือนดังบัวขาวที่บริสุทธิ์บนผิวน้ำ คุณมองเห็นความจริงที่ซ่อนอยู่และนำทางผู้อื่นด้วยความชัดเจนและสงบนิ่ง',
  },
  {
    id: 'mystic-azure',
    enTitle: 'The Mystic Azure',
    name: 'ดอกบัวฉลองขวัญ',
    image: 'assets/mystic-azure.png',
    shareImage: 'assets/mystic-azure-share.png',
    description:
      'คุณมีจิตวิญญาณของศิลปินที่เต็มไปด้วยความคิดสร้างสรรค์และมุมมองที่เฉียบคมไม่ซ้ำใคร สีม่วงอันลึกลับสะท้อนถึงโลกส่วนตัวที่น่าค้นหา คุณมีสัญชาตญาณที่แม่นยำ ดึงมนตรา คุณไม่ชอบถูกจำกัดอยู่ในกรอบและมักจะสร้างทางเดินของตัวเองเสมอ ความโดดเด่นของคุณคือการนำพาแรงบันดาลใจใหม่สู่ผู้คนรอบข้าง และเป็นผู้ที่สามารถเปลี่ยนสิ่งธรรมดาให้กลายเป็นสิ่งที่น่าอัศจรรย์ได้ด้วยไอเดียของคุณเอง',
  },
  {
    id: 'eternal-petal',
    enTitle: 'The Eternal Petal',
    name: 'ดอกบัวจงกลนี',
    image: 'assets/eternal-petal.png',
    shareImage: 'assets/eternal-petal-share.png',
    description:
      'คุณเป็นผู้ที่มีความอดทนและความสม่ำเสมออันยาวนาน เหมือนดังบัวจงกลนีที่ผลิบานอยู่เสมอ คุณเป็นเสาหลักให้กับผู้คนรอบข้างและสร้างแรงบันดาลใจให้ทุกคน',
  },
  {
    id: 'golden-wisdom',
    enTitle: 'The Golden Wisdom',
    name: 'ดอกบัวมณีสยาม',
    image: 'assets/golden-wisdom.png',
    shareImage: 'assets/golden-wisdom-share.png',
    description:
      'คุณมีปัญญาและความเฉลียวฉลาดที่ส่องสว่างดั่งทองคำ บัวมณีสยามสะท้อนถึงความโดดเด่นของคุณ คุณเป็นแสงนำทางให้ผู้อื่นก้าวข้ามความมืดและพบกับความจริงอันงดงาม',
  },
];

// ── State ────────────────────────────────────────────────────
let currentLotus = null;
let isTransitioning = false;

// ── DOM Refs ─────────────────────────────────────────────────
const landingPage    = document.getElementById('landing-page');
const predictionPage = document.getElementById('prediction-page');
const openBtn        = document.getElementById('open-btn');
const saveBtn        = document.getElementById('save-btn');
const retryBtn       = document.getElementById('retry-btn');
const predImg        = document.getElementById('pred-image');
const predName       = document.getElementById('pred-name');
const predDesc       = document.getElementById('pred-description');
const predEnTitle    = document.getElementById('pred-en-title');

// ── Randomization ────────────────────────────────────────────
// Uses crypto.getRandomValues when available for better entropy,
// falls back to Math.random for older browsers.
function getRandomLotus() {
  let idx;
  if (window.crypto && window.crypto.getRandomValues) {
    const arr = new Uint32Array(1);
    window.crypto.getRandomValues(arr);
    idx = arr[0] % LOTUS_DATA.length;
  } else {
    idx = Math.floor(Math.random() * LOTUS_DATA.length);
  }
  return LOTUS_DATA[idx];
}

// ── Page Transitions ─────────────────────────────────────────
function showPage(showEl, hideEl, onAfterHide) {
  if (isTransitioning) return;
  isTransitioning = true;

  // Exit current page
  hideEl.classList.remove('active');
  hideEl.classList.add('exit');

  setTimeout(() => {
    hideEl.classList.remove('exit');

    // Enter new page
    showEl.classList.add('active');

    if (onAfterHide) onAfterHide();

    // Reset lock after all child animations complete (~1.2s total)
    setTimeout(() => { isTransitioning = false; }, 700);
  }, 420);
}

// ── Prediction Logic ─────────────────────────────────────────
function runPrediction() {
  if (isTransitioning) return;

  currentLotus = getRandomLotus();

  // Reset animation states before showing page
  predictionPage.classList.remove('active');

  // Populate content before transition starts
  predEnTitle.textContent  = currentLotus.enTitle;
  predName.textContent     = currentLotus.name;
  predDesc.textContent     = currentLotus.description;
  predImg.src              = '';
  predImg.alt              = currentLotus.name;

  // Preload image, then transition
  const tempImg = new Image();

  const proceed = () => {
    predImg.src = currentLotus.image;
    showPage(predictionPage, landingPage);
  };

  tempImg.onload  = proceed;
  tempImg.onerror = proceed;   // Show page even if image is missing
  tempImg.src     = currentLotus.image;
}

// ── Retry Logic ───────────────────────────────────────────────
function retryPrediction() {
  if (isTransitioning) return;
  isTransitioning = true;

  // Fade out prediction page
  predictionPage.classList.remove('active');
  predictionPage.classList.add('exit');

  setTimeout(() => {
    predictionPage.classList.remove('exit');
    isTransitioning = false;

    // Pick new lotus (ensure different from current if possible)
    let next = getRandomLotus();
    if (LOTUS_DATA.length > 1) {
      let attempts = 0;
      while (next.id === currentLotus?.id && attempts < 10) {
        next = getRandomLotus();
        attempts++;
      }
    }
    currentLotus = next;

    // Update content
    predEnTitle.textContent = currentLotus.enTitle;
    predName.textContent    = currentLotus.name;
    predDesc.textContent    = currentLotus.description;
    predImg.src             = '';

    const tempImg = new Image();
    const proceed = () => {
      predImg.src = currentLotus.image;
      predictionPage.classList.add('active');
    };
    tempImg.onload  = proceed;
    tempImg.onerror = proceed;
    tempImg.src     = currentLotus.image;

  }, 420);
}

// ── Save Image ────────────────────────────────────────────────
// Downloads the share image that corresponds to the current result.
// Uses Canvas approach for same-origin assets; falls back to direct
// anchor download (works for relative paths on same server).
function saveImage() {
  if (!currentLotus) return;

  const shareUrl  = currentLotus.shareImage;
  const filename  = `${currentLotus.id}-share.png`;

  // Try canvas draw first (works if assets are same-origin, no CORS)
  const img = new Image();
  img.crossOrigin = 'anonymous';

  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth  || 1080;
      canvas.height = img.naturalHeight || 1080;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const dataURL = canvas.toDataURL('image/png');
      triggerDownload(dataURL, filename);
    } catch {
      // CORS taint or canvas failure → fall back to direct link
      triggerDownload(shareUrl, filename);
    }
  };

  img.onerror = () => {
    // Image not found → still trigger download with direct href
    triggerDownload(shareUrl, filename);
  };

  img.src = shareUrl;
}

function triggerDownload(href, filename) {
  const link = document.createElement('a');
  link.href     = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ── Event Listeners ──────────────────────────────────────────
openBtn.addEventListener('click', runPrediction);
retryBtn.addEventListener('click', retryPrediction);
saveBtn.addEventListener('click', saveImage);

// ── Init ─────────────────────────────────────────────────────
(function init() {
  landingPage.classList.add('active');
})();
