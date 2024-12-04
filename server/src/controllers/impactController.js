import axios from "axios";

// Function to call the Python API for each graph
export async function getGraph1(req, res) {
  const orgId = req.user?.org_id;

  if (!orgId) {
    return res.status(403).json({ message: "Org ID is required" });
  }

  try {
    const response = await axios.get(`http://127.0.0.1:5000/api/impact/graph1?org_id=${orgId}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching graph1 data:", error.message);
    res.status(500).json({ message: "Error fetching data for Impact Area 1" });
  }
}

export async function getGraph2(req, res) {
  const orgId = req.user?.org_id;

  if (!orgId) {
    return res.status(403).json({ message: "Org ID is required" });
  }

  try {
    const response = await axios.get(`http://127.0.0.1:5000/api/impact/graph2?org_id=${orgId}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching graph2 data:", error.message);
    res.status(500).json({ message: "Error fetching data for Impact Area 2" });
  }
}

export async function getGraph3(req, res) {
  const orgId = req.user?.org_id;

  if (!orgId) {
    return res.status(403).json({ message: "Org ID is required" });
  }

  try {
    const response = await axios.get(`http://127.0.0.1:5000/api/impact/graph3?org_id=${orgId}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching graph3 data:", error.message);
    res.status(500).json({ message: "Error fetching data for Impact Area 3" });
  }
}

export async function getGraph4(req, res) {
  const orgId = req.user?.org_id;

  if (!orgId) {
    return res.status(403).json({ message: "Org ID is required" });
  }

  try {
    const response = await axios.get(`http://127.0.0.1:5000/api/impact/graph4?org_id=${orgId}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching graph4 data:", error.message);
    res.status(500).json({ message: "Error fetching data for All Impact Areas Combined" });
  }
}
