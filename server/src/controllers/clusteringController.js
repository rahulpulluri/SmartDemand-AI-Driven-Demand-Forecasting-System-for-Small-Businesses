import axios from "axios";

export async function getProductClusteringPayload(req, res) {
  const orgId = req.user.org_id;

  if (!orgId) {
    return res.status(403).json({ message: "Org ID is required" });
  }

  const result = await axios.get(
    `http://127.0.0.1:5000/api/rfm-data?org_id=${orgId}`
  );

  return res.json(result?.data || []);
}

export async function getProductDeliveryClusteringPayload(req, res) {
  const orgId = req.user.org_id;

  if (!orgId) {
    return res.status(403).json({ message: "Org ID is required" });
  }

  const result = await axios.get(
    `http://127.0.0.1:5000/api/product_delivery_cluster?org_id=${orgId}`
  );

  return res.json(result?.data || []);
}

export async function getSalesClusteringPayload(req, res) {
  const orgId = req.user.org_id;

  if (!orgId) {
    return res.status(403).json({ message: "Org ID is required" });
  }

  const result = await axios.get(
    `http://127.0.0.1:5000/api/product_cluster?org_id=${orgId}`
  );

  return res.json(result?.data || []);
}
