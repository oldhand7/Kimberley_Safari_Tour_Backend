const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// Enable CORS for all requests
app.use(cors());

// Endpoint to fetch tours from the Bookeo API
app.get("/api/tours", async (req, res) => {
  try {
    // Make the API call to Bookeo
    const response = await axios.get("https://api.bookeo.com/v2/settings/products", {
      headers: {
        "Authorization": "Bearer AYPYT7XE4KC6U36PE9MP73351NEUHTL18EB0A42606",
        "Content-Type": "application/json",
      },
      params: {
        apiKey: "ARCTHATARKC6U36PE9MP73351NEUHTL18EB0A42606",
        secretKey: "MLpgGjVuraYiU4nMHjIC1lYG6IwvYXpV",
      },
    });

    // Send the response data back to the frontend
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching tours:", error.message);
    res.status(500).json({ error: "Failed to fetch tours" });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
