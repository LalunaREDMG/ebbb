class SheetPopulator {
  static getRandomImage(width = 800, height = 600, category = "") {
    // Use Unsplash for food-related images
    if (category === "food") {
      return `https://source.unsplash.com/random/${width}x${height}/?food,restaurant`;
    }
    // Use Picsum for general images
    return `https://picsum.photos/${width}/${height}?random=${Math.random()}`;
  }

  static generateMenuData() {
    const menuItems = [
      {
        category: "Bites",
        name: "Classic Panini",
        price: "250",
        description: "Fresh Italian bread with mozzarella and tomatoes",
      },
      {
        category: "Bites",
        name: "Breakfast Sandwich",
        price: "220",
        description: "Eggs, bacon, and cheese on sourdough",
      },
      {
        category: "Burgers",
        name: "Smashed Classic",
        price: "350",
        description: "Double patty with American cheese",
      },
      {
        category: "Burgers",
        name: "Bacon Beast",
        price: "420",
        description: "Smashed patty with crispy bacon",
      },
      {
        category: "Drinks",
        name: "Specialty Coffee",
        price: "180",
        description: "House blend espresso",
      },
      {
        category: "Drinks",
        name: "Craft Beer",
        price: "250",
        description: "Local IPA selection",
      },
    ];

    return menuItems.map((item, index) => ({
      id: index + 1,
      ...item,
      image_url: this.getRandomImage(400, 300, "food"),
    }));
  }

  static generateAnnouncementsData() {
    const announcements = [
      {
        title: "Weekend DJ Night",
        description: "Join us for amazing beats",
        date: "2024-03-23",
      },
      {
        title: "New Menu Items",
        description: "Try our latest creations",
        date: "2024-03-25",
      },
      {
        title: "Happy Hour",
        description: "50% off on drinks",
        date: "2024-03-27",
      },
    ];

    return announcements.map((item, index) => ({
      id: index + 1,
      ...item,
      image_url: this.getRandomImage(800, 400),
    }));
  }

  static generateContentData() {
    return [
      {
        section: "hero",
        title: "EIGHT",
        content: "Where food meets music",
        image_url: this.getRandomImage(1920, 1080),
      },
      {
        section: "concept",
        title: "Two Identities, One Place",
        content: "Morning cafe, evening burgers",
        image_url: this.getRandomImage(800, 600),
      },
      {
        section: "story",
        title: "Our Story",
        content: "Born from a passion for great food and music",
        image_url: this.getRandomImage(800, 600),
      },
    ];
  }

  static generateAllData() {
    console.log("=== MENU DATA ===");
    this.generateMenuData().forEach((item) => {
      console.log(
        `${item.id}\t${item.category}\t${item.name}\t${item.price}\t${item.description}\t${item.image_url}`
      );
    });

    console.log("\n=== ANNOUNCEMENTS DATA ===");
    this.generateAnnouncementsData().forEach((item) => {
      console.log(
        `${item.id}\t${item.title}\t${item.description}\t${item.date}\t${item.image_url}`
      );
    });

    console.log("\n=== CONTENT DATA ===");
    this.generateContentData().forEach((item) => {
      console.log(
        `${item.section}\t${item.title}\t${item.content}\t${item.image_url}`
      );
    });
  }
}

// Run this to get formatted data for your sheets
SheetPopulator.generateAllData();
