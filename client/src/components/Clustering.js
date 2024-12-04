import React, { useState, useEffect, useRef } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import "../styles/Clustering.css";

const Clustering = () => {
  const [customerData, setCustomerData] = useState([]);
  const [productData, setProductData] = useState([]);
  const hasFetchedCustomerData = useRef(false);
  const hasFetchedProductData = useRef(false);

  const clusterColors = {
    1: "red",
    2: "blue",
    3: "orange",
    4: "green",
  };

  const fetchCustomerData = async () => {
    if (hasFetchedCustomerData.current) return;
    hasFetchedCustomerData.current = true;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_AUTH_API_ENDPOINT}/rfm-data`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCustomerData(response.data);
    } catch (error) {
      console.error("Error fetching customer segmentation data:", error);
    }
  };

  const fetchProductData = async () => {
    if (hasFetchedProductData.current) return;
    hasFetchedProductData.current = true;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_AUTH_API_ENDPOINT}/product_delivery_cluster`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setProductData(response.data);
    } catch (error) {
      console.error("Error fetching product clustering data:", error);
    }
  };

  useEffect(() => {
    fetchCustomerData();
    fetchProductData();
  }, []);

  return (
    <div className="clustering-container">
      <div className="clustering-chart">
        <h2><b>Customer Segmentation Based on Recency and Monetary Value</b></h2>
        <Plot
          data={Object.keys(clusterColors).map((clusterId) => ({
            x: customerData
              .filter((item) => item.CustomerClusterID === parseInt(clusterId))
              .map((item) => item.Recency),
            y: customerData
              .filter((item) => item.CustomerClusterID === parseInt(clusterId))
              .map((item) => item.Monetary),
            mode: "markers",
            type: "scattergl",
            marker: { color: clusterColors[clusterId] },
            name: `Cluster ${clusterId}`,
          }))}
          layout={{
            title: "Customer Segmentation",
            xaxis: { title: "Recency (Lower values indicate more recent purchases)" },
            yaxis: { title: "Monetary (Total Payment Value)" },
            hovermode: "closest",
            width: 700,
            height: 450,
            showlegend: true,
            legend: { x: 1, xanchor: "right", y: 1 },
          }}
          config={{ responsive: true }}
        />
        <p className="chart-description">
          Customer Segmentation Based on Recency and Monetary Value: Red Cluster
          (High Value): Key focus group for driving revenue. These customers spend
          significantly but may require re-engagement if recency is high. Blue &
          Orange Clusters (Steady Customers): Consistent purchasers but with
          potential for increasing their spending. Green Cluster (At Risk): These
          customers haven't purchased recently and spend less, indicating
          potential churn and the need for retention strategies.
        </p>
      </div>

      <div className="clustering-chart">
        <h2><b>Product Clustering Based on Delivery Performance</b></h2>
        <Plot
          data={Object.keys(clusterColors).map((clusterId) => ({
            x: productData
              .filter((item) => item.DeliveryClusterID === parseInt(clusterId))
              .map((item) => item.price),
            y: productData
              .filter((item) => item.DeliveryClusterID === parseInt(clusterId))
              .map((item) => item.DeliveryDelay),
            mode: "markers",
            type: "scattergl",
            marker: { color: clusterColors[clusterId] },
            name: `Cluster ${clusterId}`,
          }))}
          layout={{
            title: "Product Clustering Based on Delivery Performance",
            xaxis: { title: "Total Sales Value" },
            yaxis: { title: "Average Delivery Delay (Hours)" },
            hovermode: "closest",
            width: 700,
            height: 450,
            showlegend: true,
            legend: { x: 1, xanchor: "right", y: 1 },
          }}
          config={{ responsive: true }}
        />
        <p className="chart-description">
          Product Clustering Based on Delivery Performance: Blue Cluster (Stable,
          Low Performance): Low sales but consistent delivery—consider revising
          sales strategy. Orange Cluster (Star Performers): High sales with
          optimal delivery times—maintain performance for high customer
          satisfaction. Green Cluster (High Delays): Delivery issues—investigate
          and improve logistics for these products to avoid customer
          dissatisfaction.
        </p>
      </div>
    </div>
  );
};

export default Clustering;
