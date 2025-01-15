import axios from "axios";

export const getLLMResponse = async (req, res) => {
  try {
    const { prompt } = req.body; // Extract user input from request body
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Proxy the request to the Flask LLM API
    const flaskResponse = await axios.post("http://127.0.0.1:5000/api/chat", { prompt });

    // Return the response from the Flask API
    return res.status(200).json(flaskResponse.data);
  } catch (error) {
    console.error("Error in LLM Node.js API:", error.message);
    return res.status(500).json({ error: "Error processing LLM request" });
  }
};
