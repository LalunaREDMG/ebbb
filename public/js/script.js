import { CONFIG } from "./config.js";
import { GoogleSheetsAPI } from "./googleSheets.js";
import { Loader } from "./components/loader.js";
import { initAnimations } from "./animations.js";
import { MenuItem } from "./components/MenuItem.js";
import { Carousel } from "./components/Carousel.js";
import { HeroCarousel } from "./components/HeroCarousel.js";

// Add DOMContentLoaded event listener back
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the app
  initializeApp();
  initSmoothScroll();
  initAnimations();
  initMobileMenu();

  // Initialize hero carousel
  const heroContainer = document.querySelector(".hero-carousel");
  if (heroContainer) {
    new HeroCarousel(heroContainer);
  }
});

// Separate async function for initialization
async function initializeApp() {
  const menuContent = document.querySelector(".menu-content");
  const announcementSlider = document.querySelector(".announcement-slider");

  try {
    // Show loading states
    Loader.show(menuContent);
    Loader.show(announcementSlider);

    const sheetsAPI = new GoogleSheetsAPI();
    await sheetsAPI.init();

    // Load and render content
    await Promise.all([
      loadMenu(sheetsAPI, menuContent),
      loadAnnouncements(sheetsAPI, announcementSlider),
    ]);
  } catch (error) {
    console.error("Failed to load content:", error);
  } finally {
    // Hide loading states
    Loader.hide(menuContent);
    Loader.hide(announcementSlider);
  }
}

const FALLBACK_DATA = {
  menu: [
    {
      name: "Classic Burger",
      description:
        "Our signature smashed burger with lettuce, tomato, and special sauce",
      price: "250",
      category: "burgers",
      image_url:
        "https://d31qjkbvvkyanm.cloudfront.net/images/recipe-images/cuban-ground-beef-panini-burger-detail-d2f84ae6.jpg",
    },
    {
      name: "Breakfast Panini",
      description: "Eggs, bacon, and cheese on toasted sourdough",
      price: "180",
      category: "bites",
      image_url:
        "https://d31qjkbvvkyanm.cloudfront.net/images/recipe-images/cuban-ground-beef-panini-burger-detail-d2f84ae6.jpg",
    },
    {
      name: "Iced Latte",
      description: "Premium coffee with cold milk",
      price: "150",
      category: "drinks",
      image_url:
        "https://d31qjkbvvkyanm.cloudfront.net/images/recipe-images/cuban-ground-beef-panini-burger-detail-d2f84ae6.jpg",
    },
  ],
  announcements: [
    {
      title: "DJ Ewan Live",
      description: "Experience the best beats this Saturday night!",
      date: "2024-03-23",
      image_url: "https://example.com/path/to/dj-event-image.jpg",
      category: "event",
    },
    {
      title: "New Menu Launch",
      description: "Try our new signature smashed burgers",
      date: "2024-03-25",
      image_url: "https://example.com/path/to/burger-image.jpg",
      category: "menu",
    },
    {
      title: "Morning Coffee Special",
      description: "Get 50% off on all coffee drinks from 7AM to 9AM",
      date: "2024-03-26",
      image_url: "https://example.com/path/to/coffee-image.jpg",
      category: "promotion",
    },
  ],
};

async function loadMenu(sheetsAPI, menuContent) {
  if (!menuContent) return;

  try {
    // Show loading state
    const loader = document.createElement("div");
    loader.className = "loader";
    loader.textContent = "Loading menu...";
    menuContent.innerHTML = "";
    menuContent.appendChild(loader);

    const menuItems = await sheetsAPI.getMenu();

    if (!menuItems?.length) {
      renderMenu(FALLBACK_DATA.menu, menuContent);
      return;
    }

    renderMenu(menuItems, menuContent);
  } catch (error) {
    console.error("Error loading menu:", error);
    renderMenu(FALLBACK_DATA.menu, menuContent);
  }
}

async function loadAnnouncements(sheetsAPI, announcementSlider) {
  try {
    const announcements = await sheetsAPI.getAnnouncements();
    if (announcements && announcements.length > 0) {
      new Carousel(announcementSlider, announcements);
    } else {
      // Use fallback data if no announcements
      new Carousel(announcementSlider, FALLBACK_DATA.announcements);
    }
  } catch (error) {
    console.error("Error loading announcements:", error);
    new Carousel(announcementSlider, FALLBACK_DATA.announcements);
  }
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Add mobile menu handler
function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger?.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
  });
}

// Add utility functions to script.js
function handleImageError(element) {
  if (element) {
    element.style.display = "none";
  }
}

// Add error handling for promotional images
document.addEventListener("DOMContentLoaded", () => {
  const promoCards = document.querySelectorAll(".promo-card");
  promoCards.forEach((card) => {
    card.addEventListener(
      "error",
      (e) => {
        if (e.target.matches("img")) {
          handleImageError(e.target);
        }
      },
      true
    );
  });
});

function renderMenu(items, container) {
  if (!container) return;

  // Clear existing content
  container.innerHTML = "";

  // Group items by category
  const menuByCategory = items.reduce((acc, item) => {
    const category = (item.category || "other").toLowerCase();
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const ITEMS_PER_PAGE = 12;
  let currentPage = 1;

  // Create menu sections
  Object.entries(menuByCategory).forEach(([category, categoryItems], index) => {
    const section = document.createElement("div");
    section.className = "menu-category";
    section.classList.add(category);

    // Show first category by default
    if (index === 0) {
      section.classList.add("active");
    }

    const itemsContainer = document.createElement("div");
    itemsContainer.className = "menu-items";

    // Function to render current page
    const renderPage = (page) => {
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const pageItems = categoryItems.slice(startIndex, endIndex);

      itemsContainer.innerHTML = "";
      pageItems.forEach((item) => {
        const menuItem = new MenuItem(item);
        itemsContainer.appendChild(menuItem.element);
      });
    };

    // Create pagination
    const paginationContainer = document.createElement("div");
    paginationContainer.className = "menu-pagination";

    const totalPages = Math.ceil(categoryItems.length / ITEMS_PER_PAGE);

    const updatePagination = () => {
      paginationContainer.innerHTML = `
        <button class="pagination-btn prev" ${
          currentPage === 1 ? "disabled" : ""
        }>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Previous
        </button>
        <span class="page-info">
          Page ${currentPage} of ${totalPages}
        </span>
        <button class="pagination-btn next" ${
          currentPage === totalPages ? "disabled" : ""
        }>
          Next
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      `;

      // Add event listeners
      const prevBtn = paginationContainer.querySelector(".prev");
      const nextBtn = paginationContainer.querySelector(".next");

      prevBtn?.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          renderPage(currentPage);
          updatePagination();
        }
      });

      nextBtn?.addEventListener("click", () => {
        if (currentPage < totalPages) {
          currentPage++;
          renderPage(currentPage);
          updatePagination();
        }
      });
    };

    // Initial render
    renderPage(currentPage);
    updatePagination();

    section.appendChild(itemsContainer);
    section.appendChild(paginationContainer);
    container.appendChild(section);
  });

  // Create category tabs
  createMenuTabs(Object.keys(menuByCategory));
}

function createMenuTabs(categories) {
  const tabsContainer = document.querySelector(".menu-tabs");
  if (!tabsContainer) return;

  // Clear existing tabs
  tabsContainer.innerHTML = "";

  // Create new tabs
  categories.forEach((category, index) => {
    const button = document.createElement("button");
    button.className = `tab-btn ${index === 0 ? "active" : ""}`;
    button.dataset.tab = category;
    button.textContent = category.charAt(0).toUpperCase() + category.slice(1);

    button.addEventListener("click", () => {
      // Update active tab
      tabsContainer.querySelectorAll(".tab-btn").forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.tab === category);
      });

      // Show selected category
      document.querySelectorAll(".menu-category").forEach((section) => {
        section.classList.toggle(
          "active",
          section.classList.contains(category)
        );
      });
    });

    tabsContainer.appendChild(button);
  });
}
