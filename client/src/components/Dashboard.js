import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "User";
    setUsername(storedUsername);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-purple-700">
        Welcome, {username}!
      </h1>
      <div className="max-w-4xl text-center mb-10">
        <p className="text-lg leading-relaxed text-gray-700">
          SmartDemand is for small business owners, providing AI-driven demand
          forecasting and business analytics. It leverages historical data,
          external data sources, and clustering techniques to generate accurate
          demand forecasts, helping businesses optimize their inventory and
          marketing strategies.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-4xl px-4">
        {/* Row 1 */}
        <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 hover:scale-105 transition-transform">
          <h2 className="text-2xl font-semibold mb-3 text-purple-600">
            Trends
          </h2>
          <p className="text-gray-600 text-center mb-4">
            Explore sales trends, top customers, and more.
          </p>
          <Link
            to="/trends"
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Go to Trends
          </Link>
        </div>

        <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 hover:scale-105 transition-transform">
          <h2 className="text-2xl font-semibold mb-3 text-purple-600">
            Impact
          </h2>
          <p className="text-gray-600 text-center mb-4">
            Analyze the impact of key metrics on business performance.
          </p>
          <Link
            to="/impact"
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Go to Impact
          </Link>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 hover:scale-105 transition-transform">
          <h2 className="text-2xl font-semibold mb-3 text-purple-600">
            Smart Chat
          </h2>
          <p className="text-gray-600 text-center mb-4">
            Interact with an AI assistant to explore insights and data trends.
          </p>
          <Link
            to="/chatbot"
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Go to Smart Chat
          </Link>
        </div>

        <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 hover:scale-105 transition-transform">
          <h2 className="text-2xl font-semibold mb-3 text-purple-600">
            Clustering
          </h2>
          <p className="text-gray-600 text-center mb-4">
            Visualize customer and product clustering insights.
          </p>
          <Link
            to="/clustering"
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Go to Clustering
          </Link>
        </div>
      </div>

      {/* Row 3: Demand Forecasting */}
      <div className="flex justify-center w-full max-w-4xl px-4 mt-6">
        <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 hover:scale-105 transition-transform w-full lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-3 text-purple-600">
            Demand Forecasting
          </h2>
          <p className="text-gray-600 text-center mb-4">
            Predict weekly stock needs by week, product, and location
            efficiently.
          </p>
          <Link
            to="/demand-forecasting"
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Go to Demand Forecasting
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
