export class Carousel {
  constructor(container, items) {
    this.container = container;
    this.items = items;
    this.currentIndex = 0;
    this.render();
    this.setupControls();
    this.startAutoPlay();
  }

  render() {
    this.container.innerHTML = `
      <div class="announcement-track">
        ${this.items
          .map(
            (item, index) => `
          <div class="announcement-slide ${index === 0 ? "active" : ""}">
            <img 
              src="${item.image_url}" 
              alt="${item.title}"
              class="announcement-image"
              loading="lazy"
              onerror="this.src='images/fallback-event.jpg'"
            >
            <div class="announcement-content">
              <span class="announcement-date">${this.formatDate(
                item.date
              )}</span>
              <h3 class="announcement-title">${item.title}</h3>
              <p class="announcement-description">${item.description}</p>
              <button class="announcement-cta">Learn More</button>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
      <div class="carousel-controls">
        <button class="carousel-arrow prev">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="carousel-dots">
          ${this.items
            .map(
              (_, index) => `
            <button class="carousel-dot ${
              index === 0 ? "active" : ""
            }" data-index="${index}"></button>
          `
            )
            .join("")}
        </div>
        <button class="carousel-arrow next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    `;

    this.track = this.container.querySelector(".announcement-track");
    this.slides = this.container.querySelectorAll(".announcement-slide");
    this.dots = this.container.querySelectorAll(".carousel-dot");
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  setupControls() {
    this.container.querySelector(".prev").addEventListener("click", () => {
      this.navigate("prev");
      this.restartAutoPlay();
    });

    this.container.querySelector(".next").addEventListener("click", () => {
      this.navigate("next");
      this.restartAutoPlay();
    });

    this.dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        this.goToSlide(index);
        this.restartAutoPlay();
      });
    });

    // Add hover pause
    this.container.addEventListener("mouseenter", () => this.stopAutoPlay());
    this.container.addEventListener("mouseleave", () => this.startAutoPlay());
  }

  navigate(direction) {
    this.slides[this.currentIndex].classList.remove("active");
    if (direction === "next") {
      this.currentIndex = (this.currentIndex + 1) % this.items.length;
    } else {
      this.currentIndex =
        (this.currentIndex - 1 + this.items.length) % this.items.length;
    }
    this.updateCarousel();
  }

  goToSlide(index) {
    this.slides[this.currentIndex].classList.remove("active");
    this.currentIndex = index;
    this.updateCarousel();
  }

  updateCarousel() {
    const offset = -this.currentIndex * 100;
    this.track.style.transform = `translateX(${offset}%)`;
    this.slides[this.currentIndex].classList.add("active");

    this.dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentIndex);
    });
  }

  restartAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.navigate("next");
    }, 5000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }
}
