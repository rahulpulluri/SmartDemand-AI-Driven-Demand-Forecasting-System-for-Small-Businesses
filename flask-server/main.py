from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import os
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from dotenv import load_dotenv  # Load environment variables
from trends import trends_bp
from impact import impact_bp

from llm import llm_bp  # Import the LLM blueprint

# Load environment variables from .env file
load_dotenv()

from demand import forecast_bp


app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Register existing blueprints
app.register_blueprint(trends_bp)
app.register_blueprint(impact_bp)
app.register_blueprint(forecast_bp)

# Register the LLM blueprint
app.register_blueprint(llm_bp)

def load_frm_df(org_id):
    # Define the path for the cached CSV file
    cache_path = f'data/business_{org_id}/rfm_results.csv'

    # Check if the CSV file already exists
    if os.path.exists(cache_path):
        # Load the cached CSV file if it exists
        rfm_df = pd.read_csv(cache_path, index_col=0)
        return rfm_df

    # Proceed with the original flow if CSV does not exist
    customers_df = pd.read_csv(f'data/business_{org_id}/customers.csv')
    orders_df = pd.read_csv(f'data/business_{org_id}/orders.csv')
    payments_df = pd.read_csv(f'data/business_{org_id}/payments.csv')

    # Calculate Recency and Monetary metrics
    current_date = pd.Timestamp.now()
    recency = orders_df.groupby('customer_id')['order_purchase_timestamp'].max().apply(
        lambda x: (current_date - pd.to_datetime(x)).days)
    orders_payments = pd.merge(orders_df[['order_id', 'customer_id']], payments_df[['order_id', 'payment_value']],
                               on='order_id')
    monetary = orders_payments.groupby('customer_id')['payment_value'].sum()

    rfm_df = pd.DataFrame({'Recency': recency, 'Monetary': monetary})

    # Scale the RFM data
    scaler = StandardScaler()
    rfm_scaled = scaler.fit_transform(rfm_df)

    # Perform KMeans clustering
    kmeans = KMeans(n_clusters=4, random_state=42)
    rfm_df['CustomerClusterID'] = kmeans.fit_predict(rfm_scaled)

    # Save the result to a CSV file
    rfm_df.to_csv(cache_path)

    return rfm_df


# Define an endpoint that returns the data as JSON - THIS API WORKS
@app.route('/api/rfm-data', methods=['GET'])
@cross_origin()
def get_rfm_data():
    org_id = request.args.get('org_id')
    rfm_df = load_frm_df(org_id)
    return jsonify(rfm_df.to_dict(orient='records'))  # Return as JSON list


def load_product_delivery_cluster(org_id):
    # Define the path for the cached CSV file
    cache_path = f'data/business_{org_id}/product_delivery_cluster.csv'

    # Check if the CSV file already exists
    if os.path.exists(cache_path):
        # Load the cached CSV file if it exists
        product_delivery_cluster = pd.read_csv(cache_path, index_col=0)
        return product_delivery_cluster

    # Proceed with the original flow if CSV does not exist
    customers_df = pd.read_csv(f'data/business_{org_id}/customers.csv')
    orders_df = pd.read_csv(f'data/business_{org_id}/orders.csv')
    order_items_df = pd.read_csv(f'data/business_{org_id}/order_items.csv')

    # Converting date columns to datetime to calculate delivery delay
    orders_df['order_delivered_timestamp'] = pd.to_datetime(orders_df['order_delivered_timestamp'], errors='coerce')
    orders_df['order_estimated_delivery_date'] = pd.to_datetime(orders_df['order_estimated_delivery_date'],
                                                                errors='coerce')

    # Calculating the delivery delay in days
    orders_df['DeliveryDelay'] = (
            orders_df['order_delivered_timestamp'] - orders_df['order_estimated_delivery_date']).dt.days

    # Merging delivery performance (delivery delay) with the order items dataset
    product_delivery = pd.merge(order_items_df, orders_df[['order_id', 'DeliveryDelay']], on='order_id', how='left')

    # Aggregating data for each product
    product_delivery_cluster = product_delivery.groupby('product_id').agg({
        'price': 'sum',  # Total sales value for each product
        'DeliveryDelay': 'mean'  # Average delivery delay for each product
    }).fillna(0)  # Filling missing values with 0 for products with no delays

    # Standardizing the sales value and delivery delay to ensure fair clustering
    scaler = StandardScaler()
    delivery_scaled = scaler.fit_transform(product_delivery_cluster[['price', 'DeliveryDelay']])

    # Applying K-Means clustering to group products based on their sales value and delivery performance
    kmeans = KMeans(n_clusters=3, random_state=42)
    product_delivery_cluster['DeliveryClusterID'] = kmeans.fit_predict(delivery_scaled)

    # Save the result to a CSV file
    product_delivery_cluster.to_csv(cache_path)

    return product_delivery_cluster


# Define an endpoint that returns the data as JSON - THIS API WORKS
@app.route('/api/product_delivery_cluster', methods=['GET'])
@cross_origin()
def get_product_delivery_cluster():
    org_id = request.args.get('org_id', 1)
    product_delivery_cluster = load_product_delivery_cluster(org_id)
    data = product_delivery_cluster.to_dict(orient='records')
    return jsonify(data)  # This should return JSON correctly


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True, port=5000)
