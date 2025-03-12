const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Update CORS options
const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("public"));

// Serve static files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serve favicon.ico
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "favicon.ico"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
