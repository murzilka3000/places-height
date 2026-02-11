document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".slides-track");
  const slides = document.querySelectorAll(".slide");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");
  const soundToggle = document.querySelector(".sound-toggle");
  const startOverlay = document.getElementById("start-overlay");

  let currentIndex = 0;
  let isMuted = false;
  let bgMusic = new Audio();
  bgMusic.loop = false;

  // 1. Сохраняем статичные пути
  document.querySelectorAll(".interactive").forEach(img => {
      img.dataset.static = img.src;
  });

  function updateSlider() {
    // При смене слайда сбрасываем все интерактивные гифки в статику
    document.querySelectorAll(".interactive").forEach(img => {
        img.src = img.dataset.static;
    });

    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    const musicSrc = slides[currentIndex].getAttribute("data-bg-music");
    
    if (bgMusic.src !== new URL(musicSrc, document.baseURI).href) {
      bgMusic.src = musicSrc;
      bgMusic.load();
    }
    if (!isMuted) bgMusic.play().catch(() => {});
  }

  // --- ЛОГИКА КЛИКА ПО ПРЕДМЕТАМ ---
  document.querySelectorAll(".interactive").forEach((item) => {
    // Флаг, чтобы нельзя было спамить кликами пока гифка играет
    let isPlaying = false;

    item.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isPlaying) return; // Если уже играет — ничего не делаем

      const gifSrc = item.getAttribute("data-gif");
      const duration = parseInt(item.getAttribute("data-duration")) || 2000;

      if (gifSrc) {
        isPlaying = true;
        // Запускаем гифку
        item.src = gifSrc + "?t=" + Date.now();

        // Через указанное время возвращаем статику
        setTimeout(() => {
          item.src = item.dataset.static;
          isPlaying = false;
        }, duration);
      }

      // Звук
      if (!isMuted) {
        const sfx = new Audio(item.getAttribute("data-sfx"));
        sfx.volume = 0.8;
        sfx.play();
      }
    });
  });

  // Остальная логика без изменений (Overlay, Sound, Nav)
  startOverlay.addEventListener("click", () => {
    startOverlay.style.display = "none";
    updateSlider();
  });

  soundToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    isMuted = !isMuted;
    soundToggle.src = isMuted ? soundToggle.dataset.off : soundToggle.dataset.on;
    isMuted ? bgMusic.pause() : bgMusic.play();
  });

  nextBtn.addEventListener("click", () => {
    if (currentIndex < slides.length - 1) { currentIndex++; updateSlider(); }
  });

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) { currentIndex--; updateSlider(); }
  });

  bgMusic.addEventListener("ended", () => {
    if (currentIndex < slides.length - 1) { currentIndex++; updateSlider(); }
  });
});