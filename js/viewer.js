let images = [];
let groups = [];
let currentIndex = 0;

async function loadGallery(folder) {
  try {
    const response = await fetch(`/images/${folder}/manifest.json`);
    if (!response.ok) throw new Error(`Manifest not found: ${response.status}`);
    const data = await response.json();
    if (!data.images || data.images.length === 0) return;
    images = data.images;
    groups = data.groups || [];
    currentIndex = 0;
    showImage();
  } catch (err) {
    console.error("Gallery failed to load:", err);
  }
}

function getGroupLabel(index) {
  // Find if this index is the start of a group
  const group = groups.find(g => g.startIndex === index);
  return group ? group.label : null;
}


function showImage() {
  const img = document.getElementById("photo");
  if (!img) return;
  img.classList.remove("loaded");
  setTimeout(() => {
    img.src = images[currentIndex];
    img.onload  = () => img.classList.add("loaded");
    img.onerror = () => img.classList.add("loaded");
  }, 150);

  const overlay = document.getElementById("group-label");
  if (overlay) {
    const label = getGroupLabel(currentIndex);
    if (label) {
      overlay.textContent = label;
      overlay.classList.add("visible");
    } else {
      overlay.classList.remove("visible");
      overlay.textContent = "";
    }
  }
}

function next() {
  if (images.length === 0) return;
  currentIndex = (currentIndex + 1) % images.length;
  showImage();
}

function prev() {
  if (images.length === 0) return;
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage();
}

// Click left half = prev, right half = next
document.addEventListener("click", e => {
  if (e.target.closest(".sidebar") || e.target.closest("button") || e.target.closest("a")) return;
  const half = window.innerWidth / 2;
  if (e.clientX < half) prev(); else next();
});

// Keyboard navigation
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
  if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   prev();
});