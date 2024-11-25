const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// Enable CORS for all requests
app.use(cors());

// Constants
const API_KEY = "ARCTHATARKC6U36PE9MP73351NEUHTL18EB0A42606";
const SECRET_KEY = "MLpgGjVuraYiU4nMHjIC1lYG6IwvYXpV";
const BASE_URL_BOOKINGS = "https://api.bookeo.com/v2/bookings";

// POST endpoint to fetch bookings
app.post("/api/bookings", async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: "productId is required" });
  }

  let startDate = moment("2024-11-01");
  const endDate = moment("2025-12-31T23:59:59Z");
  let allBookings = [];

  try {
    while (startDate.isBefore(endDate)) {
      const nextMonth = moment(startDate).add(30, "days");
      const startTime = startDate.toISOString();
      const endTime = moment.min(nextMonth, endDate).toISOString();

      const url = `${BASE_URL_BOOKINGS}?apiKey=${API_KEY}&secretKey=${SECRET_KEY}&startTime=${startTime}&endTime=${endTime}&productId=${productId}`;

      const response = await axios.get(url, { headers: { "Content-Type": "application/json" } });
      if (response.status === 200 && response.data.data) {
        allBookings = allBookings.concat(response.data.data);
      }

      startDate = nextMonth;
    }

    // Return all bookings
    res.status(200).json({ bookings: allBookings });
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});



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
