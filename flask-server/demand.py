from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from forecast import predict_test_demand_with_actual, predict_futuristic_demand_with_holiday_boost
import math

# Define the blueprint
forecast_bp = Blueprint('forecast', __name__)

# Hardcoded cutoff week and year
CUTOFF_WEEK = 36
CUTOFF_YEAR = 2018

@forecast_bp.route('/api/demand-forecast', methods=['POST'])
@cross_origin()
def predict_demand():
    # Get payload from the request
    payload = request.get_json()

    # Extract parameters from the payload
    week = payload.get('week')
    year = payload.get('year')
    city = payload.get('city')
    product_category = payload.get('product_category')

    week = int(week)
    year = int(year)

    # Validate input parameters
    if not all([week, year, city, product_category]):
        return jsonify({"error": "Missing required parameters: week, year, city, product_category"}), 400

    try:
        # Determine if the date is futuristic based on the hardcoded cutoff
        if year > CUTOFF_YEAR or (year == CUTOFF_YEAR and week > CUTOFF_WEEK):
            # Call the futuristic demand function
            result = predict_futuristic_demand_with_holiday_boost(week, year, city, product_category)

            # Return only the predicted demand with actual_demand as null
            return jsonify({
                "actual_demand": None,
                "predicted_demand": math.ceil(result["Predicted Demand"])
            })

        else:
            # Call the standard prediction function
            result = predict_test_demand_with_actual(week, year, city, product_category)

            if isinstance(result, str):
                print("error", result)
                # Return an error message if no matching data was found
                return jsonify({"error": result}), 404
            # Return the actual and predicted demand
            return jsonify({
                "actual_demand": math.ceil(result.get("Actual Demand", 0)),
                "predicted_demand": math.ceil(result.get("Predicted Demand", 0))
            })

    except Exception as e:
        # Handle unexpected errors
        return jsonify({"error": str(e)}), 500

