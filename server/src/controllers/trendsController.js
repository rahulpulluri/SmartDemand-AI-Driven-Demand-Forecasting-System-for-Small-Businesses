import axios from "axios";

export async function getAveragePriceCategory(req, res) {
  const orgId = req.user?.org_id;

  if (!orgId) {
    return res.status(403).json({ message: "Org ID is required" });
  }

  try {
    const result = await axios.get(
      `http://127.0.0.1:5000/api/average-price-category?org_id=${orgId}`
    );
    return res.json(result?.data || []);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching average price category", error });
  }
}

export async function getOrderStatusDistribution(req, res) {
  const orgId = req.user?.org_id;

  if (!orgId) {
    return res.status(403).json({ message: "Org ID is required" });
  }

  try {
    const result = await axios.get(
      `http://127.0.0.1:5000/api/order-status-distribution?org_id=${orgId}`
    );
    return res.json(result?.data || []);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching order status distribution", error });
  }
}

export async function getTopCustomersByPayment(req, res) {
  const orgId = req.user?.org_id;

  if (!orgId) {
    return res.status(403).json({ message: "Org ID is required" });
  }

  try {
    const result = await axios.get(
      `http://127.0.0.1:5000/api/top-customers-by-payment?org_id=${orgId}`
    );
    return res.json(result?.data || []);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching top customers by payment", error });
  }
}

export async function getPaymentTypeDistribution(req, res) {
  const orgId = req.user?.org_id;

  if (!orgId) {
    return res.status(403).json({ message: "Org ID is required" });
  }

  try {
    const result = await axios.get(
      `http://127.0.0.1:5000/api/payment-type-distribution?org_id=${orgId}`
    );
    return res.json(result?.data || []);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching payment type distribution", error });
  }
}

export async function getTopLocations(req, res) {
  const orgId = req.user?.org_id;

  if (!orgId) {
    return res.status(403).json({ message: "Org ID is required" });
  }

  try {
    const result = await axios.get(
      `http://127.0.0.1:5000/api/top-locations?org_id=${orgId}`
    );
    return res.json(result?.data || []);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching top locations", error });
  }
}

export async function getMonthlySalesTrend(req, res) {
  const orgId = req.user?.org_id;

  if (!orgId) {
    return res.status(403).json({ message: "Org ID is required" });
  }

  try {
    const result = await axios.get(
      `http://127.0.0.1:5000/api/monthly-sales-trend?org_id=${orgId}`
    );
    return res.json(result?.data || []);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching monthly sales trend", error });
  }
}
