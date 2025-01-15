<<<<<<< HEAD
// app.js or index.js
import express from "express";
import { authenticateJWT } from "./middleware/authenticateJWT.js";
import { login } from "./controllers/authController.js";
=======
import express from "express";
import { authenticateJWT } from "./middleware/authenticateJWT.js";
import { login } from "./controllers/authController.js";
import { getLLMResponse } from './controllers/llmController.js';
>>>>>>> cbef87c (updated flask server)
import dotenv from "dotenv";
import { seedData } from "./models/db.js";
import cors from "cors";
import {
  getProductClusteringPayload,
  getProductDeliveryClusteringPayload,
  getSalesClusteringPayload,
} from "./controllers/clusteringController.js";

import {
  getAveragePriceCategory,
  getOrderStatusDistribution,
  getTopCustomersByPayment,
  getPaymentTypeDistribution,
  getTopLocations,
  getMonthlySalesTrend,
} from "./controllers/trendsController.js";

import {
  getGraph1,
  getGraph2,
  getGraph3,
  getGraph4,
} from "./controllers/impactController.js";

import {
  getCityBySearchString,
  getProductCategoryBySearchString,
} from "./controllers/dropdownController.js";

import { getDemandForecast } from "./controllers/forecastController.js";

// Initialize dotenv to load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(
  cors({
    origin: "*", // Allow requests from all origins
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
    credentials: true, // If you're dealing with cookies/sessions
  })
);

<<<<<<< HEAD
=======
// Handle pre-flight CORS request for /llm-response
app.options("/llm-response", cors());  // Allow OPTIONS request for pre-flight CORS

>>>>>>> cbef87c (updated flask server)
// Middleware
app.use(express.json());

// Public route
app.post("/login", login);

<<<<<<< HEAD
=======
app.post('/llm-response', getLLMResponse);

>>>>>>> cbef87c (updated flask server)
// Apply JWT authentication middleware to all routes after /login
app.use(authenticateJWT);

// Protected routes
app.get("/rfm-data", getProductClusteringPayload);
app.get("/product_delivery_cluster", getProductDeliveryClusteringPayload);
app.get("/product_cluster", getSalesClusteringPayload);
app.get("/average-price-category", getAveragePriceCategory);
app.get("/order-status-distribution", getOrderStatusDistribution);
app.get("/top-customers-by-payment", getTopCustomersByPayment);
app.get("/payment-type-distribution", getPaymentTypeDistribution);
app.get("/top-locations", getTopLocations);
app.get("/monthly-sales-trend", getMonthlySalesTrend);
app.get("/impact/graph1", getGraph1);
app.get("/impact/graph2", getGraph2);
app.get("/impact/graph3", getGraph3);
app.get("/impact/graph4", getGraph4);

// City search API
app.get("/cities", (req, res) => {
  const { query } = req.query; // Extract query parameter
  try {
    const result = getCityBySearchString(query); // Call the function with the query string
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in /search-city:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Product category search API
app.get("/product-categories", (req, res) => {
  const { query } = req.query; // Extract query parameter
  try {
    const result = getProductCategoryBySearchString(query); // Call the function with the query string
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in /search-product-category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/demand-forecast", getDemandForecast);

// app.get("/get-product-clustering-payload", getProductClusteringPayload);

app.get("/protected", (req, res) => {
  res.json({
    message: "This is a protected route",
    user: req.user, // Access the user object from the request
  });
});

<<<<<<< HEAD
=======


>>>>>>> cbef87c (updated flask server)
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);

  // Uncomment this to seed data (organizations and users) on the first run
  // seedData();
});
