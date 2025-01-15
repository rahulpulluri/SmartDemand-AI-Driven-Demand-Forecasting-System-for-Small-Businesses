# **SmartDemand: AI-Driven Demand Forecasting System for Small Businesses**

## **Project Overview**  
SmartDemand is an AI-powered demand forecasting and business intelligence system designed to help small businesses make data-driven decisions. By leveraging machine learning models for demand forecasting, clustering, and providing actionable business insights, SmartDemand empowers businesses to optimize their operations, improve resource allocation, and stay ahead of market trends.

### **Key Benefits**:
- **Precise Demand Predictions**: Prevent overstocking/understocking.
- **Natural Language-Powered Chatbot**: Instant query resolutions.
- **Customizable Data Pipelines**: Tailored for business-specific requirements.

### **Project Demo Link**  
*Add your project demo link here.*

## **Features and Functionalities**

### **1. Authentication and Authorization**
- Secure login with **JWT** for user identity and role-based access.
- Data isolation ensures that users can only access data relevant to their business.

### **2. Dashboard**  
A centralized navigation hub showcasing key features:
- **Trends**  
- **Impact**  
- **Smart Chat**  
- **Clustering**  
- **Demand Forecasting**

### **3. Trends**  
Visual representations of essential business data:
- Monthly sales trends.
- Average product price by category.
- Order status distribution.
- Top customers by payments.
- Payment type analysis.
- Top locations by order volume.

### **4. Impact**  
- Analysis of feature importance to identify actionable business areas.
- Simulated sales improvements based on areas such as delivery delays, discounts, and seasonal priorities.

### **5. Clustering**  
Customer and product segmentation for strategic insights:
- Customer segmentation based on recency and spending patterns.
- Product clustering by seasonality and sales performance.
- Delivery performance-based clustering for logistical insights.

### **6. Demand Forecasting**  
- Predicts product demand with **84% accuracy** using historical data.
- Allows users to input variables such as **year, week, product category,** and **city** for specific forecasts.
- Features a comparison with actual data to build user confidence.

### **7. Smart Chat**  
- **GPT-4 powered chatbot** for non-technical user queries.
- Provides insights such as payment trends, customer behavior, and sales performance.

---

## **Technical Design**

### **System Architecture**  
- **Frontend**: Built with **React**, hosted on **Vercel**.  
- **Backend**:  
  - **Node.js**: Handles authentication.  
  - **Flask**: Manages data processing, hosted on **AWS**.

### **AI Modules**  
- **Clustering**: Implemented using **K-Means** and **Dynamic Time Warping (DTW)**.  
- **Sales and Demand Forecasting**: Developed with **XGBoost**.  
- **Chatbot**: Fine-tuned **GPT-4** model for natural language interactions.

---

## **Machine Learning Models**

### **1. Sales-Based Model**  
Predicts total sales for high-level strategic planning.

### **2. Quantity-Based Model**  
Forecasts product demand based on key factors such as location and seasonality.

---

## **Enriched Dataset**  
The dataset integrates:
- Clustering insights.
- Geographic and time-based features.
- Data enhancements for advanced analytics and natural language processing.

---
