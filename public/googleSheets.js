class GoogleSheetsAPI {
  constructor() {
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    await new Promise((resolve, reject) => {
      gapi.load("client", async () => {
        try {
          await gapi.client.init({
            apiKey: CONFIG.GOOGLE_API_KEY,
            discoveryDocs: [
              "https://sheets.googleapis.com/$discovery/rest?version=v4",
            ],
          });
          this.initialized = true;
          resolve();
        } catch (error) {
          console.error("Error initializing Google Sheets API:", error);
          reject(error);
        }
      });
    });
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
      return null;
    }
  }

  async getMenu() {
    const data = await this.fetchData(
      `${CONFIG.SHEETS.MENU}!${CONFIG.RANGES.MENU}`
    );
    return (
      data?.map((row) => ({
        id: row[0],
        category: row[1],
        name: row[2],
        price: row[3],
        description: row[4],
        image_url: row[5],
      })) || []
    );
  }

  async getAnnouncements() {
    const data = await this.fetchData(
      `${CONFIG.SHEETS.ANNOUNCEMENTS}!${CONFIG.RANGES.ANNOUNCEMENTS}`
    );
    return (
      data?.map((row) => ({
        id: row[0],
        title: row[1],
        description: row[2],
        date: row[3],
        image_url: row[4],
      })) || []
    );
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
}
