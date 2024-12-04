import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import "../styles/Impact.css";

const Impact = () => {
  const [graph1Data, setGraph1Data] = useState({ current: [], modified: [] });
  const [graph2Data, setGraph2Data] = useState({ current: [], modified: [] });
  // const [graph3Data, setGraph3Data] = useState({ current: [], modified: [] });
  const [graph4Data, setGraph4Data] = useState({ current: [], modified: [] });
  const [titles, setTitles] = useState(["", "", "", ""]);

  const fetchGraphData = async (graphNum, setter, titleSetter, titleIndex) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_AUTH_API_ENDPOINT}/impact/graph${graphNum}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log(`Data from graph${graphNum}:`, response.data);

      const graphData = response.data.data;

      // Format dates to YYYY-MM-DD before setting state
      const formattedCurrent = graphData.current_payment.map((item) => ({
        "x-variable": new Date(item["x-variable"]).toLocaleDateString("en-CA"),
        "y-variable": item["y-variable"],
      }));
      const formattedModified = graphData.modified_payment.map((item) => ({
        "x-variable": new Date(item["x-variable"]).toLocaleDateString("en-CA"),
        "y-variable": item["y-variable"],
      }));

      setter({
        current: formattedCurrent,
        modified: formattedModified,
      });

      const title = response.data.title;
      titleSetter((prevTitles) => {
        const updatedTitles = [...prevTitles];
        updatedTitles[titleIndex] = title;
        return updatedTitles;
      });
    } catch (error) {
      console.error(`Error fetching data for Graph ${graphNum}:`, error);
    }
  };

  useEffect(() => {
    fetchGraphData(1, setGraph1Data, setTitles, 0);
    fetchGraphData(2, setGraph2Data, setTitles, 1);
    // fetchGraphData(3, setGraph3Data, setTitles, 2);
    fetchGraphData(4, setGraph4Data, setTitles, 3);
  }, []);

  const createPlotData = (data) => [
    {
      x: data.current.map((item) => item["x-variable"]),
      y: data.current.map((item) => item["y-variable"]),
      type: "scatter",
      mode: "lines+markers",
      name: "Current Payment",
      marker: { color: "blue" },
    },
    {
      x: data.modified.map((item) => item["x-variable"]),
      y: data.modified.map((item) => item["y-variable"]),
      type: "scatter",
      mode: "lines+markers",
      name: "Modified Payment",
      marker: { color: "red" },
    },
  ];

  return (
    <div className="impact-container">
      {[graph1Data, graph2Data, graph4Data].map((data, index) => (
        <div key={index} className="impact-card">
          <h2>{titles[index]}</h2>
          <Plot
            data={createPlotData(data)}
            layout={{
              xaxis: { title: "Order Purchase Timestamp", automargin: true },
              yaxis: { title: "Sum of Payment Value" },
              margin: { t: 20, l: 50, r: 30, b: 50 },
            }}
            className="plot-container"
          />
        </div>
      ))}
    </div>
  );
};

export default Impact;
