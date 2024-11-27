const express = require("express");
const cors = require("cors");
const axios = require("axios");
const moment = require("moment")
const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// Enable CORS for all requests
app.use(cors());


// Constants
const API_KEY = "ARCTHATARKC6U36PE9MP73351NEUHTL18EB0A42606";
const SECRET_KEY = "MLpgGjVuraYiU4nMHjIC1lYG6IwvYXpV";
const BASE_URL_BOOKINGS = "https://api.bookeo.com/v2/bookings";

// GET endpoint to fetch bookings
app.get("/api/bookings", async (req, res) => {
  const { productId } = req.query;

  if (!productId) {
    return res.status(400).json({ error: "productId is required" });
  }

  let startDate = moment("2024-11-01");
  const endDate = moment("2025-12-31T23:59:59Z");
  let allBookings = [];
  let startTimes = []; // Array to store all startTimes

  try {
    while (startDate.isBefore(endDate)) {
      const nextMonth = moment(startDate).add(30, "days");
      const startTime = startDate.toISOString();
      const endTime = moment.min(nextMonth, endDate).toISOString();

      const url = `${BASE_URL_BOOKINGS}?apiKey=${API_KEY}&secretKey=${SECRET_KEY}&startTime=${startTime}&endTime=${endTime}&productId=${productId}`;

      const response = await axios.get(url, { headers: { "Content-Type": "application/json" } });

      if (response.status === 200 && response.data.data && response.data.data.length > 0) {
        allBookings = allBookings.concat(response.data.data);

        // Extract startTimes from response.data.data
        response.data.data.forEach(booking => {
          if (booking.startTime) {
            startTimes.push(booking.startTime);
          }
        });
      }

      startDate = nextMonth;
    }

    // Remove duplicate startTimes
    const uniqueStartTimes = Array.from(new Set(startTimes));
    console.log(uniqueStartTimes);

    // Return unique startTimes
    res.json({ startTimes: uniqueStartTimes });
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

app.post('/api/webhook', async (req, res) => {
  try {
    const payload = JSON.stringify(req.body); // Stringify the request body
    const response = await axios.post(
      'https://hooks.zapier.com/hooks/catch/20664855/2iyu3p8/',
      { data: payload }, // Wrap the payload in an object with key "data"
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    res.status(200).json({ message: 'Payload sent successfully!', data: response.data });
  } catch (error) {
    res.status(500).json({ message: 'Error sending payload', error: error.message });
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
