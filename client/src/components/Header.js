import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-purple-700 text-white p-4 flex items-center justify-between shadow-md">
      <Link to="/" className="text-2xl font-bold hover:underline">
        SmartDemand
      </Link>
      <nav>
        <ul className="flex space-x-10">
          <li>
            <Link to="/trends" className="hover:underline text-lg">
              Trends
            </Link>
          </li>
          <li>
            <Link to="/impact" className="hover:underline text-lg">
              Impact
            </Link>
          </li>
          <li>
            <Link to="/chatbot" className="hover:underline text-lg">
              Smart Chat
            </Link>
          </li>
          <li>
            <Link to="/clustering" className="hover:underline text-lg">
              Clustering
            </Link>
          </li>
          <li>
            <Link to="/demand-forecasting" className="hover:underline text-lg">
              Demand Forecasting
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="text-lg bg-transparent border-none cursor-pointer hover:underline"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
