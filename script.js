let lyrics = [];
let currentIndex = -1;
let isPlaying = false;
let currentTime = 0;
let timer = null;
const PACE = 3; // Seconds per line

const viewport = document.getElementById("lyrics-viewport");
const playIcon = document.getElementById("play-icon");
const progressFill = document.getElementById("progress-fill");
const timeCurrent = document.getElementById("time-current");
const timeTotal = document.getElementById("time-total");
const studio = document.getElementById("studio-overlay");
const input = document.getElementById("lyric-input");

function toggleStudio() {
  studio.classList.toggle("active");
}

function saveLyrics() {
  const text = input.value.trim();
  if (!text) return;

  lyrics = text.split("\n").filter((l) => l.trim() !== "");
  render();
  reset();
  toggleStudio();
}

function render() {
  viewport.innerHTML = "";
  lyrics.forEach((text, i) => {
    const div = document.createElement("div");
    div.className = "lyric-item";
    div.id = `line-${i}`;
    div.textContent = text;
    div.onclick = () => seek(i);
    viewport.appendChild(div);
  });
  timeTotal.textContent = formatTime(lyrics.length * PACE);
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function togglePlayback() {
  if (lyrics.length === 0) return;
  isPlaying = !isPlaying;

  if (isPlaying) {
    playIcon.innerHTML = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`;
    playIcon.classList.remove("ml-1");
    timer = setInterval(tick, 100);
  } else {
    playIcon.innerHTML = `<path d="M8 5v14l11-7z"/>`;
    playIcon.classList.add("ml-1");
    clearInterval(timer);
  }
}

function tick() {
  currentTime += 0.1;
  const total = lyrics.length * PACE;

  if (currentTime >= total) {
    reset();
    return;
  }

  const activeIdx = Math.floor(currentTime / PACE);
  if (activeIdx !== currentIndex) {
    highlight(activeIdx);
  }

  // Update UI
  progressFill.style.width = `${(currentTime / total) * 100}%`;
  timeCurrent.textContent = formatTime(currentTime);
}

function highlight(index) {
  if (currentIndex >= 0) {
    document.getElementById(`line-${currentIndex}`)?.classList.remove("active");
  }
  currentIndex = index;
  const el = document.getElementById(`line-${index}`);
  if (el) {
    el.classList.add("active");
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function seek(index) {
  currentTime = index * PACE;
  highlight(index);
  if (!isPlaying) togglePlayback();
  tick();
}

function changeLine(dir) {
  let n = currentIndex + dir;
  if (n >= 0 && n < lyrics.length) seek(n);
}

function reset() {
  clearInterval(timer);
  isPlaying = false;
  currentTime = 0;
  currentIndex = -1;
  playIcon.innerHTML = `<path d="M8 5v14l11-7z"/>`;
  playIcon.classList.add("ml-1");
  progressFill.style.width = "0%";
  timeCurrent.textContent = "0:00";
  document
    .querySelectorAll(".lyric-item")
    .forEach((l) => l.classList.remove("active"));
  viewport.scrollTo({ top: 0, behavior: "smooth" });
}

// Initialize
input.value =
  "Welcome to LyricMini\nCompact & Powerful\nSpotify Styled Interface\nPaste your lyrics here\nClick lines to seek\nEnjoy the rhythm\nCreated with Flow";
saveLyrics();

// Gradient Backdrop Logic
function togglebackgroundgradient() {
  const modal = document.getElementById("gradient-overlay");
  const backdrop = document.getElementById("backdrop");
  modal.classList.toggle("active");
  backdrop.classList.toggle("active");
}

function updateGradientPreview() {
  const start = document.getElementById("color-start").value;
  const end = document.getElementById("color-end").value;
  const angle = document.getElementById("gradient-angle").value;
  const preview = document.getElementById("gradient-preview");

  document.getElementById("hex-start").innerText = start.toUpperCase();
  document.getElementById("hex-end").innerText = end.toUpperCase();
  document.getElementById("swatch-start").style.background = start;
  document.getElementById("swatch-end").style.background = end;
  document.getElementById("angle-value").innerText = angle + "°";

  preview.style.background = `linear-gradient(${angle}deg, ${start}, ${end})`;
}

function saveGradient() {
  const start = document.getElementById("color-start").value;
  const end = document.getElementById("color-end").value;
  const angle = document.getElementById("gradient-angle").value;

  document.body.style.background = `linear-gradient(${angle}deg, ${start}, ${end})`;
  togglebackgroundgradient();
}
