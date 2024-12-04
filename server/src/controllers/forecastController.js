import axios from "axios";

export async function getDemandForecast(req, res) {
  const orgId = req.user?.org_id;

  // Check if the org ID exists
  if (!orgId) {
    return res.status(403).json({ message: "Org ID is required" });
  }

  // Extract parameters from the request body
  const { year, week, productCategory, city } = req.body;

  // Validate required fields
  if (!year || !week || !productCategory || !city) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Call the data server API
    const result = await axios.post(
      "http://127.0.0.1:5000/api/demand-forecast",
      {
        org_id: orgId,
        year,
        week,
        product_category: productCategory,
        city,
      }
    );

    const data = result?.data;

    // Check if predicted value is null
    if (data?.predicted_demand == null) {
      return res
        .status(500)
        .json({ message: "Predicted value is missing from the response" });
    }

    // Respond with the data from the data server
    return res.json(data);
  } catch (error) {
    console.error("Error fetching demand forecast:", error.message);
    return res.status(500).json({ message: "Failed to fetch demand forecast" });
  }
}
