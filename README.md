# SmartDemand: AI-Driven Demand Forecasting System for Small Businesses

## Project Overview
**SmartDemand** is an AI-powered demand forecasting and business intelligence system designed to help small businesses make data-driven decisions. By leveraging machine learning models for demand forecasting, clustering, and providing actionable business insights, SmartDemand empowers businesses to optimize their operations, improve resource allocation, and stay ahead of market trends:

- Precise demand predictions to prevent overstocking/understocking.
- A natural language-powered chatbot for instant queries.
- Customizable business-specific data pipelines.

**[Project Demo Link](https://drive.google.com/file/d/16lr-ffZnhNj1-xm57ZRzHhdTGMxORkAh/view )**

## Features and Functionalities

### Authentication and Authorization
- Secure login with JWT for user identity and role-based access.
- Data isolation ensuring users only access data relevant to their business.

### Dashboard
Centralized navigation hub showcasing features like:

- Trends
- Impact
- Smart Chat
- Clustering
- Demand Forecasting

### Trends
Visualizations include:
1. Monthly sales trends.
2. Average product price by category.
3. Order status distribution.
4. Top customers by payments.
5. Payment type analysis.
6. Top locations by order volume.

### Impact
- Analysis of feature importance to derive actionable business areas.
- Simulated sales improvements based on impact areas like delivery delays, discounts, and seasonal priorities.

### Clustering
Clustering methodologies include:
1. Customer segmentation by recency and spending.
2. Product clustering by seasonality and sales performance.
3. Delivery performance-based clustering for logistical insights.

### Demand Forecasting
- Predicts product demand with 84% accuracy based on historical data.
- Allows inputs like year, week, product category, and city for forecasts.
- Features comparison with actual data for confidence building.

### Smart Chat
- GPT-4 powered chatbot for non-technical user queries.
- Provides insights like payment trends, customer behavior, and sales performance.

---

## Technical Design

### System Architecture
1. **Frontend**: React, hosted on Vercel.
2. **Backend**: Node.js for authentication; Flask for data processing, hosted on AWS.
3. **AI Modules**:
   - Clustering with K-Means and Dynamic Time Warping (DTW).
   - XGBoost-based sales and demand forecasting models.
   - Fine-tuned GPT-4 chatbot.

### Machine Learning Models
#### Sales-Based Model
Predicts total sales for strategic planning.

#### Quantity-Based Model
Forecasts product demand based on inputs like location and seasonality.

### Enriched Dataset
Integrates clustering insights, geographic data, and time-based features to support advanced analytics and natural language responses.

