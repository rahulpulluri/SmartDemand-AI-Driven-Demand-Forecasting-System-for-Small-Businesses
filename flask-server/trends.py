import pandas as pd
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin

# Define the blueprint
trends_bp = Blueprint('trends', __name__)

def clean_dataset(org_id):
    data = pd.read_csv(f'data/business_{org_id}/dataset_refined_clustering_module.csv')

    # Convert date columns to datetime and handle missing values
    data['order_purchase_timestamp'] = pd.to_datetime(data['order_purchase_timestamp'], errors='coerce')
    data['order_delivered_timestamp'] = pd.to_datetime(data['order_delivered_timestamp'], errors='coerce')
    data['order_estimated_delivery_date'] = pd.to_datetime(data['order_estimated_delivery_date'], errors='coerce')

    # Drop rows with missing essential data
    data.dropna(subset=['order_purchase_timestamp', 'price'], inplace=True)

    # Define the data size for 18 months
    train_size = int(len(data) * (18 / 24))
    train_data = data.iloc[:train_size]
    return train_data
# bar graph
@trends_bp.route('/api/average-price-category', methods=['GET'])
@cross_origin()
def average_price_category():
    org_id = request.args.get('org_id', 2)
    train_data = clean_dataset(org_id)
    avg_price_by_category = train_data.groupby('product_category_name')['price'].mean().sort_values(ascending=False).head(10)

    # Structure response
    response = {
        "title": "Top 10 Product Categories by Average Price",
        "X-label": "Product Category",
        "Y-label": "Average Price",
        "data": [{"x-variable": key, "y-variable": value} for key, value in avg_price_by_category.to_dict().items()]
    }
    return jsonify(response)
# bar graph
@trends_bp.route('/api/order-status-distribution', methods=['GET'])
@cross_origin()
def order_status_distribution():
    org_id = request.args.get('org_id', 1)
    train_data = clean_dataset(org_id)
    order_status_counts = train_data['order_status'].value_counts()

    # Structure response
    response = {
        "title": "Order Status Distribution",
        "X-label": "Order Status",
        "Y-label": "Count",
        "data": [{"x-variable": key, "y-variable": value} for key, value in order_status_counts.to_dict().items()]
    }
    return jsonify(response)

# bar graph
@trends_bp.route('/api/top-customers-by-payment', methods=['GET'])
@cross_origin()
def top_customers_by_payment():
    org_id = request.args.get('org_id', 1)
    train_data = clean_dataset(org_id)
    top_customers = train_data.groupby('customer_id')['payment_value'].sum().sort_values(ascending=False).head(10)

    # Structure response
    response = {
        "title": "Top 10 Customers by Total Payment",
        "X-label": "Customer ID",
        "Y-label": "Total Payment",
        "data": [{"x-variable": str(key), "y-variable": value} for key, value in top_customers.to_dict().items()]
    }
    return jsonify(response)
# pie chart
@trends_bp.route('/api/payment-type-distribution', methods=['GET'])
@cross_origin()
def payment_type_distribution():
    org_id = request.args.get('org_id', 1)
    train_data = clean_dataset(org_id)
    payment_type_counts = train_data['payment_type'].value_counts()

    # Structure response
    response = {
        "title": "Payment Type Distribution",
        "X-label": "Payment Type",
        "Y-label": "Count",
        "data": [{"x-variable": key, "y-variable": value} for key, value in payment_type_counts.to_dict().items()]
    }
    return jsonify(response)

# pie chart
@trends_bp.route('/api/top-locations', methods=['GET'])
@cross_origin()
def top_locations():
    org_id = request.args.get('org_id', 3)
    train_data = clean_dataset(org_id)
    top_locations = train_data['customer_city'].value_counts().head(10)

    # Structure response
    response = {
        "title": "Top 10 Customer Locations",
        "X-label": "City",
        "Y-label": "Customer Count",
        "data": [{"x-variable": key, "y-variable": value} for key, value in top_locations.to_dict().items()]
    }
    return jsonify(response)

# line graph
@trends_bp.route('/api/monthly-sales-trend', methods=['GET'])
@cross_origin()
def monthly_sales_trend():
    org_id = request.args.get('org_id', 1)
    train_data = clean_dataset(org_id)
    train_data['month'] = train_data['order_purchase_timestamp'].dt.to_period('M')
    monthly_sales = train_data.groupby('month')['payment_value'].sum()

    # Structure response
    response = {
        "title": "Monthly Sales Trend",
        "X-label": "Month",
        "Y-label": "Total Sales",
        "data": [{"x-variable": str(key), "y-variable": value} for key, value in monthly_sales.to_dict().items()]
    }
    return jsonify(response)
