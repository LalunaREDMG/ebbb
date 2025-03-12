import { GoogleSheetsAPI } from "../googleSheets.js";

export class HeroCarousel {
  constructor(container) {
    this.container = container;
    this.slides = [];
    this.currentIndex = 0;
    this.init();
  }

  async init() {
    try {
      const sheetsAPI = new GoogleSheetsAPI();
      await sheetsAPI.init();
      this.slides = await sheetsAPI.getHeroSlides();

      // Debug log to check the data
      console.log("Raw hero slides data:", this.slides);

      if (!this.slides || this.slides.length === 0) {
        throw new Error("No slides data received");
      }

      // Verify image URLs and data
      this.slides.forEach((slide, index) => {
        console.log(`Slide ${index + 1} full data:`, {
          id: slide.id,
          title: slide.title,
          subtitle: slide.subtitle,
          time: slide.time,
          category: slide.category,
          image_url: slide.image_url,
        });
      });
    } catch (error) {
      console.error("Error loading hero slides:", error);
      // Fallback data if API fails
      this.slides = [
        {
          title: "Morning Bites",
          subtitle: "Start your day with our artisanal paninis",
          time: "7AM - 3PM",
          category: "breakfast",
          image_url:
            "https://www.labraabakery.com/sites/default/files/2023-08/Panini-Focaccia-Turkey-Pesto-Aioli-sandwich.jpg",
        },
        {
          title: "Weekend Bites",
          subtitle: "Live DJ performances every weekend",
          time: "8PM - 2AM",
          category: "events",
          image_url:
            "https://nonemacloud.com/cdn-cgi/image/width%3D1440%2Cheight%3D1440%2Cfit%3Dscale-down%2Cformat%3Dauto/images/dj.jpg",
        },
        {
          title: "Night Bites",
          subtitle: "Experience our signature smashed burger",
          time: "5PM - 11PM",
          category: "dinner",
          image_url:
            "https://img.delicious.com.au/gKTnV89n/w759-h506-cfill/del/2022/10/p89-salt-and-vinegar-crumbed-chicken-burger-176372-1.jpg",
        },
      ];
    }

    this.render();
    this.setupControls();
    this.startAutoPlay();
  }

  render() {
    console.log("Rendering slides with data:", this.slides);

    this.container.innerHTML = `
      <div class="hero-carousel">
        <div class="hero-track">
          ${this.slides
            .map((slide, index) => {
              // Debug the image URL being used
              const imageUrl =
                slide.image_url || "https://placehold.co/1920x1080";
              console.log(`Rendering slide ${index + 1}:`, {
                title: slide.title,
                imageUrl: imageUrl,
              });

              return `
                <div class="hero-slide ${index === 0 ? "active" : ""}">
                  <div class="hero-background" 
                       style="background-image: url('${imageUrl}')">
                  </div>
                  <div class="hero-content">
                    <div class="hero-text">
                      <span class="hero-time">${slide.time}</span>
                      <h1 class="hero-title">${slide.title}</h1>
                      <p class="hero-subtitle">${slide.subtitle}</p>
                      <button class="hero-cta">Learn More</button>
                    </div>
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
        <div class="hero-controls">
          <button class="hero-arrow prev">&lt;</button>
          <div class="hero-dots">
            ${this.slides
              .map(
                (_, i) => `
              <button class="hero-dot ${
                i === 0 ? "active" : ""
              }" data-index="${i}"></button>
            `
              )
              .join("")}
          </div>
          <button class="hero-arrow next">&gt;</button>
        </div>
      </div>
    `;

    this.track = this.container.querySelector(".hero-track");
    this.slides = this.container.querySelectorAll(".hero-slide");
    this.dots = this.container.querySelectorAll(".hero-dot");
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

    this.container.addEventListener("mouseenter", () => this.stopAutoPlay());
    this.container.addEventListener("mouseleave", () => this.startAutoPlay());
  }

  navigate(direction) {
    this.slides[this.currentIndex].classList.remove("active");
    if (direction === "next") {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    } else {
      this.currentIndex =
        (this.currentIndex - 1 + this.slides.length) % this.slides.length;
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
    }, 6000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }
}
