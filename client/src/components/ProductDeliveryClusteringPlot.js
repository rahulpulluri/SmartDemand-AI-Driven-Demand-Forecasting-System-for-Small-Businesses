// import React, { useState, useEffect, useRef } from "react";
// import Plot from "react-plotly.js";
// import axios from "axios";

// const ProductDeliveryClusteringPlot = ({ clusterColors }) => {
//   const [data, setData] = useState([]);
//   const hasFetched = useRef(false);

//   const fetchData = async () => {
//     if (hasFetched.current) return;
//     hasFetched.current = true;

//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_AUTH_API_ENDPOINT}/product_delivery_cluster`,
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );
//       setData(response.data);
//     } catch (error) {
//       console.error("Error fetching plot data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <section className="plotly-section">
//       <h2>Product Clustering Based on Delivery Performance</h2>
//       <Plot
//         data={Object.keys(clusterColors).map((clusterId) => ({
//           x: data
//             .filter((item) => item.DeliveryClusterID === parseInt(clusterId))
//             .map((item) => item.price),
//           y: data
//             .filter((item) => item.DeliveryClusterID === parseInt(clusterId))
//             .map((item) => item.DeliveryDelay),
//           mode: "markers",
//           type: "scattergl",
//           marker: { color: clusterColors[clusterId] },
//           name: `Cluster ${clusterId}`,
//         }))}
//         layout={{
//           title: "Product Clustering Based on Delivery Performance",
//           xaxis: { title: "Total Sales Value" },
//           yaxis: { title: "Average Delivery Delay (Hours)" },
//           hovermode: "closest",
//           width: 1500,
//           height: 900,
//           showlegend: true,
//           legend: { x: 1, xanchor: "right", y: 1 },
//         }}
//         config={{ responsive: true }}
//       />
//       <p className="chart-text">
//         Product Clustering Based on Delivery Performance: Blue Cluster (Stable,
//         Low Performance): Low sales but consistent delivery—consider revising
//         sales strategy. Orange Cluster (Star Performers): High sales with
//         optimal delivery times—maintain performance for high customer
//         satisfaction. Green Cluster (High Delays): Delivery issues—investigate
//         and improve logistics for these products to avoid customer
//         dissatisfaction. Forecasting Insight: Orange Cluster products, which
//         have high sales with low delivery delays, are expected to continue
//         driving demand. Maintaining efficient logistics and inventory management
//         will be crucial to sustaining this trend.
//       </p>
//     </section>
//   );
// };

// export default ProductDeliveryClusteringPlot;
