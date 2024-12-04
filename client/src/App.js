import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Trends from "./components/Trends"; // Import Trends component
import Impact from "./components/Impact"; // Import Impact component
import Header from "./components/Header";
import Footer from "./components/Footer";
import Clustering from "./components/Clustering";
import DemandForecasting from "./components/DemandForecasting";
import "./styles/Login.css";
import "./styles/Footer.css";
// import Chatbot from "./components/Chatbot";
import Chat from "./components/Chat";

// Layout component to include Header and Footer conditionally
const Layout = ({ children }) => {
  const location = useLocation(); // Get the current route
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/") {
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    }
  }, [location.pathname, navigate]);

  return (
    <>
      {/* Render Header and Footer only if not on the login page */}
      {location.pathname !== "/login" && <Header />}
      {children}
      {location.pathname !== "/login" && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Define route for the Login page */}
          <Route path="/login" element={<Login />} />
          {/* Define route for the Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Define route for the Trends page */}
          <Route path="/trends" element={<Trends />} />
          {/* Define route for the Impact page */}
          <Route path="/impact" element={<Impact />} />
          {/* Corrected Clustering route */}
          <Route path="/clustering" element={<Clustering />} />
          {/* Corrected Clustering route */}
          <Route path="/demand-forecasting" element={<DemandForecasting />} />
          {/* Default route */}
          <Route path="/" element={<Login />} />
           {/* Chatbot route */}
           <Route path="/chatbot" element={<Chat />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
