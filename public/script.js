document.addEventListener("DOMContentLoaded", async () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const links = document.querySelectorAll(".nav-links li");

  hamburger.addEventListener("click", () => {
    // Toggle Nav
    navLinks.classList.toggle("active");

    // Animate Links
    links.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = "";
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${
          index / 7 + 0.3
        }s`;
      }
    });

    // Hamburger Animation
    hamburger.classList.toggle("active");
  });

  // Close menu when clicking a link
  links.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      hamburger.classList.remove("active");
    });
  });

  // Initialize Google Sheets API
  const sheetsAPI = new GoogleSheetsAPI();

  // Load and render menu
  async function loadMenu() {
    const menuItems = await sheetsAPI.getMenu();
    const menuContent = document.querySelector(".menu-content");
    const menuTabs = document.querySelector(".menu-tabs");

    // Group menu items by category
    const menuByCategory = menuItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    // Create menu content
    Object.entries(menuByCategory).forEach(([category, items]) => {
      const categorySection = document.createElement("div");
      categorySection.className = `menu-category ${category.toLowerCase()}`;
      categorySection.innerHTML = `
        <div class="menu-items">
          ${items
            .map(
              (item) => `
            <div class="menu-item">
              ${
                item.image_url
                  ? `<img src="${item.image_url}" alt="${item.name}">`
                  : ""
              }
              <div class="menu-item-details">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <span class="price">₱${item.price}</span>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
      menuContent.appendChild(categorySection);
    });
  }

  // Load and render announcements
  async function loadAnnouncements() {
    const announcements = await sheetsAPI.getAnnouncements();
    const announcementSlider = document.querySelector(".announcement-slider");

    announcementSlider.innerHTML = announcements
      .map(
        (announcement) => `
      <div class="announcement">
        ${
          announcement.image_url
            ? `<img src="${announcement.image_url}" alt="${announcement.title}">`
            : ""
        }
        <h3>${announcement.title}</h3>
        <p>${announcement.description}</p>
        <span class="date">${announcement.date}</span>
      </div>
    `
      )
      .join("");
  }

  // Load and update content
  async function loadContent() {
    const content = await sheetsAPI.getContent();

    content.forEach((item) => {
      const section = document.querySelector(`#${item.section.toLowerCase()}`);
      if (section) {
        if (item.title) {
          const titleEl = section.querySelector("h2");
          if (titleEl) titleEl.textContent = item.title;
        }
        if (item.content) {
          const contentEl = section.querySelector("p");
          if (contentEl) contentEl.textContent = item.content;
        }
        if (item.image_url) {
          const img = section.querySelector("img");
          if (img) {
            img.src = item.image_url;
            img.alt = item.title;
          }
        }
      }
    });
  }

  // Load all content
  try {
    await loadMenu();
    await loadAnnouncements();
    await loadContent();
  } catch (error) {
    console.error("Error loading content:", error);
  }
});
