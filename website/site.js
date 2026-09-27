/**
 * Coco Chess Engine — Client-Side Site Utilities & ClickSpark
 * Created & Maintained by NotKaede-11
 */

// ==========================================================================
// 1. DOWNLOAD PLATFORM TAB SWITCHER & OS DETECTION
// ==========================================================================

const RELEASE_TAG = "v1.5.0";
const DOWNLOAD_BASE_URL = `https://github.com/NotKaede-11/Coco-Engine/releases/download/${RELEASE_TAG}`;

const PLATFORM_BUILDS = {
  windows: {
    name: "Windows",
    filename: "coco-chess-windows-x86-64-popcnt.exe",
    requirements: "Windows 10/11 64-bit · Intel Core or AMD Ryzen with POPCNT / AVX2 support · Embedded NNUE",
    url: `${DOWNLOAD_BASE_URL}/coco-chess-windows-x86-64-popcnt.exe`
  },
  linux: {
    name: "Linux",
    filename: "coco-chess-linux-x86-64-popcnt",
    requirements: "Linux x86-64-v3 or ARM64 · GLIBC 2.31+ · Supports Ubuntu, Debian, Fedora, Arch · Embedded NNUE",
    url: `${DOWNLOAD_BASE_URL}/coco-chess-linux-x86-64-popcnt`
  },
  macos: {
    name: "macOS",
    filename: "coco-chess-macos-apple-silicon",
    requirements: "macOS 12+ Monterey, Ventura, Sonoma · Native Apple Silicon (M1/M2/M3) & Intel builds · Embedded NNUE",
    url: `${DOWNLOAD_BASE_URL}/coco-chess-macos-apple-silicon`
  }
};

function initDownloadTabs() {
  const tabButtons = document.querySelectorAll('.os-tab-btn');
  const filenameEl = document.getElementById('targetFilename');
  const reqEl = document.getElementById('targetRequirements');
  const downloadLink = document.getElementById('targetDownloadBtn');
  const heroDownloadLink = document.getElementById('heroDownloadBtn');

  function selectPlatform(key) {
    const build = PLATFORM_BUILDS[key] || PLATFORM_BUILDS.windows;
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.os === key);
    });

    if (filenameEl) filenameEl.textContent = build.filename;
    if (reqEl) reqEl.textContent = build.requirements;
    if (downloadLink) {
      downloadLink.href = build.url;
      downloadLink.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 12l-4-4h2.5V2h3v6H12L8 12zm-6 2h12v1.5H2V14z"/></svg> Download for ${build.name}`;
    }
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      selectPlatform(btn.dataset.os);
    });
  });

  // OS Detection
  let detected = 'windows';
  const ua = navigator.userAgent || '';
  if (/Macintosh|Mac OS X/i.test(ua)) {
    detected = 'macos';
  } else if (/Linux/i.test(ua) && !/Android/i.test(ua)) {
    detected = 'linux';
  }
  selectPlatform(detected);

  if (heroDownloadLink) {
    heroDownloadLink.href = '#downloads';
    heroDownloadLink.innerHTML = `Go to Download Section <svg class="arrow" aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 3v10m0 0l-4-4m4 4l4-4"/></svg>`;
  }
}

// ==========================================================================
// 2. TERMINAL UCI COPY & TOAST NOTIFICATION
// ==========================================================================

function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

function initTerminalCopy() {
  const copyBtn = document.getElementById('copyTerminalBtn');

  const UCI_COMMANDS = `./coco-chess-windows-x86-64-popcnt.exe
uci
setoption name Hash value 256
setoption name Threads value 4
isready
position startpos moves e2e4 e7e5
go movetime 1000`;

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(UCI_COMMANDS).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg> Copied!`;
        showToast('UCI commands copied to clipboard!');
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2200);
      });
    });
  }
}

// ==========================================================================
// 3. REACT BITS: CLICK SPARK ANIMATION
// ==========================================================================

class ClickSpark {
  constructor(options = {}) {
    this.sparkColor = options.sparkColor || '#b83225';
    this.sparkSize = options.sparkSize || 10;
    this.sparkRadius = options.sparkRadius || 15;
    this.sparkCount = options.sparkCount || 8;
    this.duration = options.duration || 400;

    this.sparks = [];
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'click-spark-canvas';
    this.canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.resize();
    window.addEventListener('resize', () => this.resize());
    document.addEventListener('pointerdown', (e) => this.handleClick(e));
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
  }

  handleClick(e) {
    const target = e.target;
    // Context-sensitive color: white on dark cards/terminal/buttons, vermilion on paper canvas
    const isDark = target.closest('.release-card-dark, .terminal-block, .btn-primary, .btn-header');
    const color = isDark ? '#ffffff' : this.sparkColor;

    this.sparks.push({
      x: e.clientX,
      y: e.clientY,
      startTime: performance.now(),
      color: color
    });

    if (this.sparks.length === 1) {
      requestAnimationFrame((t) => this.animate(t));
    }
  }

  easeOutQuad(t) {
    return t * (2 - t);
  }

  animate(currentTime) {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.sparks = this.sparks.filter((spark) => {
      const elapsed = currentTime - spark.startTime;
      if (elapsed >= this.duration) return false;

      const progress = elapsed / this.duration;
      const eased = this.easeOutQuad(progress);
      const radius = this.sparkRadius + eased * this.sparkSize * 2.2;
      const length = this.sparkSize * (1 - eased);
      const alpha = 1 - progress;

      this.ctx.save();
      this.ctx.strokeStyle = spark.color;
      this.ctx.lineWidth = 2;
      this.ctx.lineCap = 'round';
      this.ctx.globalAlpha = alpha;

      for (let i = 0; i < this.sparkCount; i++) {
        const angle = (i * 2 * Math.PI) / this.sparkCount;
        const x1 = spark.x + Math.cos(angle) * radius;
        const y1 = spark.y + Math.sin(angle) * radius;
        const x2 = spark.x + Math.cos(angle) * (radius + length);
        const y2 = spark.y + Math.sin(angle) * (radius + length);

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
      }

      this.ctx.restore();
      return true;
    });

    if (this.sparks.length > 0) {
      requestAnimationFrame((t) => this.animate(t));
    }
  }
}

// ==========================================================================
// 4. INITIALIZATION ON DOM CONTENT LOADED
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initDownloadTabs();
  initTerminalCopy();

  // Initialize ClickSpark
  new ClickSpark({
    sparkColor: '#b83225',
    sparkSize: 10,
    sparkRadius: 15,
    sparkCount: 8,
    duration: 400
  });
});
