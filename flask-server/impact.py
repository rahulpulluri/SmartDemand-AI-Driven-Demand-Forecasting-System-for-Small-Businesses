import pandas as pd
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin

impact_bp = Blueprint('impact', __name__)


def load_modified_data(org_id):
    """Loads and cleans modified dataset."""
    df = pd.read_csv(f'data/business_{org_id}/modified_6_months_data2.csv')
    df['order_purchase_timestamp'] = pd.to_datetime(df['order_purchase_timestamp'], errors='coerce')
    df.dropna(subset=['order_purchase_timestamp'], inplace=True)
    return df


def load_original_data(org_id):
    """Loads and cleans original dataset."""
    df = pd.read_csv(f'data/business_{org_id}/input_6_months_data.csv')
    df['order_purchase_timestamp'] = pd.to_datetime(df['order_purchase_timestamp'], errors='coerce')
    df.dropna(subset=['order_purchase_timestamp'], inplace=True)
    return df


def get_graph_data(original_df, modified_df, condition):
    """Creates a unified dataset selecting values based on condition and applies weekly resampling."""
    # Merge the original and modified datasets on 'order_purchase_timestamp'
    merged_df = pd.merge(
        original_df[['order_purchase_timestamp', 'payment_value']],
        modified_df[['order_purchase_timestamp', 'payment_value', 'DeliveryPriority', 'CustomerPriority',
                     'ProductSeasonalPriority', 'is_holiday_season']],
        on='order_purchase_timestamp',
        suffixes=('_original', '_modified'),
        how='outer'
    ).fillna(0)

    # Create a new column with condition-based values
    merged_df['selected_payment'] = merged_df.apply(
        lambda row: row['payment_value_modified'] if condition(row) else row['payment_value_original'],
        axis=1
    )

    # Resample weekly for smoother trend lines
    resampled_data = merged_df.set_index('order_purchase_timestamp')['selected_payment'].resample(
        'W').sum().reset_index(name='modified_payment')
    original_resampled = merged_df.set_index('order_purchase_timestamp')['payment_value_original'].resample(
        'W').sum().reset_index(name='current_payment')

    # Merge the resampled data to include both modified and original payment values
    result = pd.merge(
        resampled_data, original_resampled,
        on='order_purchase_timestamp',
        how='outer'
    )

    return result


# Define API routes for each graph
@impact_bp.route('/api/impact/graph1', methods=['GET'])
@cross_origin()
def graph1():
    org_id = request.args.get('org_id', 3)
    original_df = load_original_data(org_id)
    modified_df = load_modified_data(org_id)

    # Define condition for Impact Area 1: High Delivery Priority with Delay
    condition = lambda row: row['DeliveryPriority'] == 1
    graph_data = get_graph_data(original_df, modified_df, condition)

    response = {
        "title": "Impact Area 1 - High Delivery Priority with Delay",
        "X-label": "Order Purchase Timestamp",
        "Y-label": "Sum of Payment Value",
        "data": {
            "current_payment": [{"x-variable": row['order_purchase_timestamp'], "y-variable": row['current_payment']}
                                for _, row in graph_data.iterrows()],
            "modified_payment": [{"x-variable": row['order_purchase_timestamp'], "y-variable": row['modified_payment']}
                                 for _, row in graph_data.iterrows()]
        }
    }
    return jsonify(response)

# Repeat similar API routes for graph2, graph3, and graph4, each using the appropriate conditions
@impact_bp.route('/api/impact/graph2', methods=['GET'])
@cross_origin()
def graph2():
    org_id = request.args.get('org_id', 3)
    original_df = load_original_data(org_id)
    modified_df = load_modified_data(org_id)

    # Define condition for Impact Area 2: High Customer Priority
    condition = lambda row: row['CustomerPriority'] == 1
    graph_data = get_graph_data(original_df, modified_df, condition)

    response = {
        "title": "Impact Area 2 - High Customer Priority",
        "X-label": "Order Purchase Timestamp",
        "Y-label": "Sum of Payment Value",
        "data": {
            "current_payment": [{"x-variable": row['order_purchase_timestamp'], "y-variable": row['current_payment']}
                                for _, row in graph_data.iterrows()],
            "modified_payment": [{"x-variable": row['order_purchase_timestamp'], "y-variable": row['modified_payment']}
                                 for _, row in graph_data.iterrows()]
        }
    }
    return jsonify(response)

@impact_bp.route('/api/impact/graph3', methods=['GET'])
@cross_origin()
def graph3():
    org_id = request.args.get('org_id', 3)
    original_df = load_original_data(org_id)
    modified_df = load_modified_data(org_id)

    # Define condition for Impact Area 3: High Seasonal Priority During Holiday Season
    condition = lambda row: row['ProductSeasonalPriority'] == 1 and row['is_holiday_season'] == 1
    graph_data = get_graph_data(original_df, modified_df, condition)

    response = {
        "title": "Impact Area 3 - High Seasonal Priority During Holiday Season",
        "X-label": "Order Purchase Timestamp",
        "Y-label": "Sum of Payment Value",
        "data": {
            "current_payment": [{"x-variable": row['order_purchase_timestamp'], "y-variable": row['current_payment']}
                                for _, row in graph_data.iterrows()],
            "modified_payment": [{"x-variable": row['order_purchase_timestamp'], "y-variable": row['modified_payment']}
                                 for _, row in graph_data.iterrows()]
        }
    }
    return jsonify(response)

@impact_bp.route('/api/impact/graph4', methods=['GET'])
@cross_origin()
def graph4():
    org_id = request.args.get('org_id', 3)
    original_df = load_original_data(org_id)
    modified_df = load_modified_data(org_id)

    # Define condition for Impact Area 4: All Impact Areas Combined
    condition = lambda row: (row['DeliveryPriority'] == 1) or (row['CustomerPriority'] == 1) or (row['ProductSeasonalPriority'] == 1)
    graph_data = get_graph_data(original_df, modified_df, condition)

    response = {
        "title": "All Impact Areas Combined",
        "X-label": "Order Purchase Timestamp",
        "Y-label": "Sum of Payment Value",
        "data": {
            "current_payment": [{"x-variable": row['order_purchase_timestamp'], "y-variable": row['current_payment']}
                                for _, row in graph_data.iterrows()],
            "modified_payment": [{"x-variable": row['order_purchase_timestamp'], "y-variable": row['modified_payment']}
                                 for _, row in graph_data.iterrows()]
        }
    }
    return jsonify(response)