import React, { useState, useEffect, useRef } from "react";
import Plot from "react-plotly.js";
import axios from "axios";

const ProductClusteringPlot = () => {
  const [data, setData] = useState([]);
  const hasFetched = useRef(false);

  const fetchData = async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_AUTH_API_ENDPOINT}/product_cluster`,
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
      <h2>Product Clustering Based on Sales Count and Sales Value</h2>
      <Plot
        data={[
          {
            x: data.map((item) => item.SalesCount),
            y: data.map((item) => item.TotalSalesValue),
            mode: "markers",
            type: "scatter",
            marker: {
              size: data.map((item) => item.TotalSalesValue),
              color: "blue",
            },
            text: data.map((item) => item.ProductID),
            name: "Product Clustering",
          },
        ]}
        layout={{
          title: "Product Clustering",
          xaxis: { title: "Sales Count" },
          yaxis: { title: "Total Sales Value" },
          hovermode: "closest",
          width: 1500,
          height: 900,
        }}
        config={{ responsive: true }}
      />
    </section>
  );
};

export default ProductClusteringPlot;
