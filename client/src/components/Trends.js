import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import "../styles/Trends.css";

const Trends = () => {
  const [monthlySalesTrend, setMonthlySalesTrend] = useState([]);
  const [averagePriceCategory, setAveragePriceCategory] = useState([]);
  const [orderStatusDistribution, setOrderStatusDistribution] = useState([]);
  const [topCustomersByPayment, setTopCustomersByPayment] = useState([]);
  const [paymentTypeDistribution, setPaymentTypeDistribution] = useState([]);
  const [topLocations, setTopLocations] = useState([]);

  const fetchData = async (endpoint, setter) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_AUTH_API_ENDPOINT}/${endpoint}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log(`Data from ${endpoint}:`, response.data); // Log the data to see its structure
      setter(response.data.data); // Only set the 'data' part
    } catch (error) {
      console.error(`Error fetching ${endpoint} data:`, error);
    }
  };

  useEffect(() => {
    fetchData("monthly-sales-trend", setMonthlySalesTrend);
    fetchData("average-price-category", setAveragePriceCategory);
    fetchData("order-status-distribution", setOrderStatusDistribution);
    fetchData("top-customers-by-payment", setTopCustomersByPayment);
    fetchData("payment-type-distribution", setPaymentTypeDistribution);
    fetchData("top-locations", setTopLocations);
  }, []);

  return (
    <div className="trends-container">
      <div className="trend-card">
        <h2>Monthly Sales Trend</h2>
        <Plot
          data={[
            {
              x: monthlySalesTrend.map((item) => item["x-variable"]),
              y: monthlySalesTrend.map((item) => item["y-variable"]),
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "blue" },
            },
          ]}
          layout={{ title: "Monthly Sales Trend" }}
          className="plot-container"
        />
      </div>

      <div className="trend-card">
        <h2>Average Price by Category</h2>
        <Plot
          data={[
            {
              x: averagePriceCategory.map((item) => item["x-variable"]),
              y: averagePriceCategory.map((item) => item["y-variable"]),
              type: "bar",
              marker: { color: "orange" },
            },
          ]}
          layout={{ title: "Average Price by Category" }}
          className="plot-container"
        />
      </div>

      <div className="trend-card">
        <h2>Order Status Distribution</h2>
        <Plot
          data={[
            {
              labels: orderStatusDistribution.map((item) => item["x-variable"]),
              values: orderStatusDistribution.map((item) => item["y-variable"]),
              type: "pie",
            },
          ]}
          layout={{ title: "Order Status Distribution" }}
          className="plot-container pie"
        />
        <Plot
          data={[
            {
              labels: orderStatusDistribution
                .filter((item) => item["x-variable"] !== "delivered")
                .map((item) => item["x-variable"]),
              values: orderStatusDistribution
                .filter((item) => item["x-variable"] !== "delivered")
                .map((item) => item["y-variable"]),
              type: "pie",
            },
          ]}
          layout={{ title: "Order Status Distribution (without delivered)" }}
          className="plot-container pie"
        />
      </div>

      <div className="trend-card">
        <h2>Top Customers by Payment</h2>
        <Plot
          data={[
            {
              x: topCustomersByPayment.map((item) => item["x-variable"]),
              y: topCustomersByPayment.map((item) => item["y-variable"]),
              type: "bar",
              marker: { color: "green" },
            },
          ]}
          layout={{ title: "Top Customers by Payment" }}
          className="plot-container"
        />
      </div>

      <div className="trend-card">
        <h2>Payment Type Distribution</h2>
        <Plot
          data={[
            {
              labels: paymentTypeDistribution.map((item) => item["x-variable"]),
              values: paymentTypeDistribution.map((item) => item["y-variable"]),
              type: "pie",
            },
          ]}
          layout={{ title: "Payment Type Distribution" }}
          className="plot-container"
        />
      </div>

      <div className="trend-card">
        <h2>Top Locations</h2>
        <Plot
          data={[
            {
              x: topLocations.map((item) => item["x-variable"]),
              y: topLocations.map((item) => item["y-variable"]),
              type: "bar",
              marker: { color: "purple" },
            },
          ]}
          layout={{ title: "Top Locations" }}
          className="plot-container"
        />
      </div>
    </div>
  );
};

export default Trends;
