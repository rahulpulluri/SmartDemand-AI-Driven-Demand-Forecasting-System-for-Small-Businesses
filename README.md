# SmartDemand: AI Driven Demand Forecasting System for Small Businesses

SmartDemand is a Web Application designed for small business owners, providing AI-driven demand forecasting and business analytics. It leverages historical data, external data sources, and clustering techniques to generate accurate demand forecasts, helping businesses optimize their inventory and marketing strategies.

## Features:

**AI Demand Forecasting:** Generates predictions based on historical and external data.

**Customer Data Clustering:** Segments customer data to identify trends and improve forecast accuracy.

**Historical Data Viewing:** Displays past sales and customer demographics.

**Forecast Insights:** Provides actionable insights with graphs and charts.

**Data Privacy & Security:** Ensures each business's data is securely stored and isolated.

**Report Exporting:** Allows exporting of historical and forecast data for offline use.

**Notifications:** Alerts users when new forecast data is available.

<<<<<<< HEAD
=======
## Links:

**Wiki:** https://code.vt.edu/gsamheeta/stockproq/-/wikis/home

**Phase 1:** https://code.vt.edu/gsamheeta/stockproq/-/wikis/Phase-1

**Figma UI Wireframes:** https://code.vt.edu/gsamheeta/stockproq/-/wikis/Figma-UI-Wireframes

>>>>>>> cbef87c (updated flask server)
## Server

To setup the server, clone the repo, navigate to the server folder. Then do the following:

1. run `npm i`.
2. run `sqlite3 smart-demand.db` in the console. Leave the cli running.
3. create a .env file from your .env.sample file.
4. generate a SECRET_KEY and add it to the .env file.
5. Uncomment `seedData()` from the index.js file. This will create the tables and add initial data to it.
6. run your server with `npm start`. Server will run on port 3000.
7. Comment out `seedData()`, you won't need it after the first run.
8. Run `select * from users;` in the sqlite cli. If you see 4 users, everything went well. You can exit the cli with `.exit`.
