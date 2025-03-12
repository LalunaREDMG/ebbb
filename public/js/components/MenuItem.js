export class MenuItem {
  constructor(item) {
    console.log("Creating menu item with data:", item);
    this.item = item;
    this.element = this.createMenuItem();
    this.modal = this.createModal();
    document.body.appendChild(this.modal);
  }

  createMenuItem() {
    const menuItem = document.createElement("div");
    menuItem.className = `menu-item ${this.item.category}`;

    // Debug the item data
    console.log("Menu item details:", {
      name: this.item.name,
      price: this.item.price,
      description: this.item.description,
      image: this.item.image_url,
      category: this.item.category,
    });

    menuItem.innerHTML = `
      <div class="menu-item-content">
        ${
          this.item.image_url
            ? `<div class="menu-item-image">
                 <img src="${this.item.image_url}" 
                      alt="${this.item.name}"
                      loading="lazy"
                      onerror="this.src='images/fallback-${this.item.category}.jpg'"
                 >
               </div>`
            : `<div class="menu-item-image">
                 <img src="images/fallback-${this.item.category}.jpg" 
                      alt="Fallback ${this.item.category}"
                 >
               </div>`
        }
        <div class="menu-item-info">
          <div class="menu-item-header">
            <h3 class="menu-item-name">${this.item.name || "Untitled"}</h3>
            <span class="menu-item-price">₱${this.item.price || ""}</span>
          </div>
          <p class="menu-item-description">${this.item.description || ""}</p>
          ${
            this.item.category === "drinks"
              ? `<div class="drink-options">
                   <span class="drink-option">Hot</span>
                   <span class="drink-option">Iced</span>
                 </div>`
              : ""
          }
        </div>
      </div>
    `;

    menuItem.addEventListener("click", () => this.showDetails());
    return menuItem;
  }

  createModal() {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        ${
          this.item.image_url
            ? `
          <img src="${this.item.image_url}" 
               alt="${this.item.name}" 
               class="modal-image"
               onerror="this.style.display='none'"
          >
        `
            : ""
        }
        <h2>${this.item.name}</h2>
        <p>${this.item.description}</p>
        <div class="modal-details">
          <div class="detail-item">
            <div class="detail-label">Price</div>
            <div class="detail-value">₱${this.item.price}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Category</div>
            <div class="detail-value">${this.item.category}</div>
          </div>
          ${
            this.item.calories
              ? `
            <div class="detail-item">
              <div class="detail-label">Calories</div>
              <div class="detail-value">${this.item.calories}</div>
            </div>`
              : ""
          }
        </div>
      </div>
    `;

    modal.querySelector(".modal-close").addEventListener("click", (e) => {
      e.stopPropagation();
      this.hideDetails();
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) this.hideDetails();
    });

    return modal;
  }

  showDetails() {
    this.modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  hideDetails() {
    this.modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}
