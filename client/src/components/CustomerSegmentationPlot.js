import React, { useState, useEffect, useRef } from "react";
import Plot from "react-plotly.js";
import axios from "axios";

const CustomerSegmentationPlot = ({ clusterColors }) => {
  const [data, setData] = useState([]);
  const hasFetched = useRef(false);

  const fetchData = async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_AUTH_API_ENDPOINT}/rfm-data`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching plot data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="plotly-section">
      <h2>Customer Segmentation Based on Recency and Monetary Value</h2>
      <Plot
        data={Object.keys(clusterColors).map((clusterId) => ({
          x: data
            .filter((item) => item.CustomerClusterID === parseInt(clusterId))
            .map((item) => item.Recency),
          y: data
            .filter((item) => item.CustomerClusterID === parseInt(clusterId))
            .map((item) => item.Monetary),
          mode: "markers",
          type: "scattergl",
          marker: { color: clusterColors[clusterId] },
          name: `Cluster ${clusterId}`,
        }))}
        layout={{
          title: "Customer Segmentation",
          xaxis: {
            title: "Recency (Lower values indicate more recent purchases)",
          },
          yaxis: { title: "Monetary (Total Payment Value)" },
          hovermode: "closest",
          width: 1500,
          height: 900,
          showlegend: true,
          legend: { x: 1, xanchor: "right", y: 1 },
        }}
        config={{ responsive: true }}
      />
      <p className="chart-text">
        Customer Segmentation Based on Recency and Monetary Value: Red Cluster
        (High Value): Key focus group for driving revenue. These customers spend
        significantly but may require re-engagement if recency is high. Blue &
        Orange Clusters (Steady Customers): Consistent purchasers but with
        potential for increasing their spending. Green Cluster (At Risk): These
        customers haven't purchased recently and spend less, indicating
        potential churn and the need for retention strategies. Forecasting
        Insight: The Red Cluster customers, with high monetary value but varying
        recency, are expected to contribute the most to future revenue. A
        focused re-engagement campaign could increase near-term purchases,
        especially among high-recency customers.
      </p>
    </section>
  );
};

export default CustomerSegmentationPlot;
