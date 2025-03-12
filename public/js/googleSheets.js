import { CONFIG } from "./config.js";

export class GoogleSheetsAPI {
  constructor() {
    this.initialized = false;
    this.apiKey = CONFIG.GOOGLE_API_KEY;
    this.spreadsheetId = CONFIG.SPREADSHEET_ID;
    this.heroRange = CONFIG.HERO_SHEET_RANGE;
    this.menuRange = CONFIG.MENU_SHEET_RANGE;
    this.MENU_RANGE = "Menu!A2:F";
    this.ANNOUNCEMENTS_RANGE = "Announcements!A2:F";
  }

  async init() {
    if (this.initialized) return;

    try {
      await new Promise((resolve, reject) => {
        gapi.load("client", { callback: resolve, onerror: reject });
      });

      await gapi.client.init({
        apiKey: this.apiKey,
        discoveryDocs: [
          "https://sheets.googleapis.com/$discovery/rest?version=v4",
        ],
      });

      this.initialized = true;
      console.log("Google Sheets API initialized successfully");
    } catch (error) {
      console.error("Error initializing Google Sheets API:", error);
      throw error;
    }
  }

  async getMenu() {
    try {
      if (!this.initialized) {
        await this.init();
      }

      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: this.menuRange,
      });

      // Debug the raw response
      console.log("Raw menu data:", response.result.values);

      const rows = response.result.values || [];
      return rows.map((row) => ({
        id: row[0]?.trim() || "",
        category: (row[1]?.trim() || "").toLowerCase(),
        name: row[2]?.trim() || "",
        price: row[3]?.trim() || "",
        description: row[4]?.trim() || "",
        image_url: row[5]?.trim() || "",
        options: row[6]?.trim() || "", // For drink options like hot/iced
      }));
    } catch (error) {
      console.error("Error fetching menu:", error);
      throw error;
    }
  }

  async fetchData(range) {
    await this.init();
    try {
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: CONFIG.SPREADSHEET_ID,
        range: range,
      });
      return response.result.values;
    } catch (error) {
      console.error("Error fetching data:", error);
      console.error("Spreadsheet ID:", CONFIG.SPREADSHEET_ID);
      console.error("Range:", range);
      console.error("Full error details:", {
        message: error.message,
        status: error.status,
        result: error.result,
        body: error.body,
      });
      return null;
    }
  }

  async getAnnouncements() {
    try {
      if (!gapi.client.sheets) {
        throw new Error("Sheets API not initialized");
      }

      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: this.ANNOUNCEMENTS_RANGE,
      });

      if (!response.result || !response.result.values) {
        throw new Error("No announcement data received");
      }

      return response.result.values.map((row) => ({
        id: row[0] || "",
        title: row[1] || "",
        description: row[2] || "",
        date: row[3] || "",
        image_url: row[4] || "",
        category: row[5] || "", // For filtering if needed
      }));
    } catch (error) {
      console.error("Error fetching announcements:", error);
      throw error;
    }
  }

  async getContent() {
    const data = await this.fetchData(
      `${CONFIG.SHEETS.CONTENT}!${CONFIG.RANGES.CONTENT}`
    );
    return (
      data?.map((row) => ({
        section: row[0],
        title: row[1],
        content: row[2],
        image_url: row[3],
      })) || []
    );
  }

  async getHeroSlides() {
    try {
      if (!this.initialized) {
        await this.init();
      }

      console.log("Fetching hero slides with range:", this.heroRange);

      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: this.heroRange,
      });

      // Debug the raw response
      console.log("Raw hero slides data:", response.result.values);
      console.log(
        "Number of columns in response:",
        response.result.values?.[0]?.length
      );

      const rows = response.result.values || [];

      // Skip header row if it exists
      const dataRows = rows[0]?.includes("ID") ? rows.slice(1) : rows;

      return dataRows.map((row) => {
        // Debug each row
        console.log("Processing hero slide row:", row);
        console.log("Row length:", row.length);
        console.log("Image URL from row:", row[5]);

        return {
          id: row[0]?.trim() || "",
          title: row[1]?.trim() || "",
          subtitle: row[2]?.trim() || "",
          time: row[3]?.trim() || "",
          category: (row[4]?.trim() || "").toLowerCase(),
          image_url: row[5]?.trim() || "", // Image_URL is in the 6th column
        };
      });
    } catch (error) {
      console.error("Error fetching hero slides:", error);
      throw error;
    }
  }
}
