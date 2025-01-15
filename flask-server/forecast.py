import pandas as pd
import pickle

# Load pre-trained model and scaler
with open('demand_model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)
with open('scaler.pkl', 'rb') as scaler_file:
    scaler = pickle.load(scaler_file)

# Load additional rank mappings
city_rank = pd.read_csv('city_rank.csv')
category_rank = pd.read_csv('category_rank.csv')
weekly_data = pd.read_csv('weekly_data.csv')

def predict_test_demand_with_actual(week, year, city, product_category):
    # Fetch city and category ranks
    city_rank_value = city_rank[city_rank['customer_city'] == city]['city_rank'].values[0] \
        if city in city_rank['customer_city'].values else len(city_rank) + 1
    category_rank_value = category_rank[category_rank['product_category_name'] == product_category]['category_rank'].values[0] \
        if product_category in category_rank['product_category_name'].values else len(category_rank) + 1

    # Filter the weekly dataset
    matching_data = weekly_data[
        (weekly_data['year'] == year) &
        (weekly_data['week_of_year'] == week) &
        (weekly_data['city_rank'] == city_rank_value) &
        (weekly_data['category_rank'] == category_rank_value)
    ]
    actual_quantity = None
    predicted_quantity = None

    if matching_data.empty:
        print(f"No matching data for Year: {year}, Week: {week}, City Rank: {city_rank_value}, Category Rank: {category_rank_value} in the test dataset.")
    else:
        # Extract actual demand
        actual_quantity = matching_data.iloc[0]['quantity']

        # Create input for prediction
        input_vector = matching_data.iloc[0].drop('quantity').to_frame().T
        input_vector_scaled = scaler.transform(input_vector)

        # Predict demand
        predicted_quantity = model.predict(input_vector_scaled)[0]

    return {
        "Year": year,
        "Week": week,
        "City": city,
        "Product Category": product_category,
        "City Rank": city_rank_value,
        "Category Rank": category_rank_value,
        "Actual Demand": actual_quantity,
        "Predicted Demand": predicted_quantity
    }




import pandas as pd
import math
from datetime import datetime

# Existing imports and model/scaler loading code...


# Existing imports and model/scaler loading code...

# Load train_cutoff from metadata
with open('model_metadata.pkl', 'rb') as metadata_file:
    metadata = pickle.load(metadata_file)

train_cutoff = metadata["train_cutoff"]

# def predict_futuristic_demand_with_holiday_boost(week, year, city, product_category):
#     # Fetch city and category ranks
#     city_rank_value = city_rank[city_rank['customer_city'] == city]['city_rank'].values[0] \
#         if city in city_rank['customer_city'].values else len(city_rank) + 1
#     category_rank_value = category_rank[category_rank['product_category_name'] == product_category]['category_rank'].values[0] \
#         if product_category in category_rank['product_category_name'].values else len(category_rank) + 1
#
#     # Define holiday season weeks dynamically (from year 2018 to 2024)
#     holiday_weeks = [
#         {"year": 2018, "weeks": [47, 48, 49, 50, 51, 52]},
#         {"year": 2019, "weeks": [8, 19, 24, 27, 47, 48, 49, 50, 51, 52]},
#         {"year": 2020, "weeks": [7, 19, 24, 27, 47, 48, 49, 50, 51, 52]},
#         {"year": 2021, "weeks": [7, 19, 24, 27, 47, 48, 49, 50, 51, 52]},
#         {"year": 2022, "weeks": [8, 19, 24, 27, 47, 48, 49, 50, 51, 52]},
#         {"year": 2023, "weeks": [8, 19, 24, 27, 47, 48, 49, 50, 51, 52]},
#         {"year": 2024, "weeks": [8, 19, 24, 27, 47, 48, 49, 50, 51, 52]}
#     ]
#
#     # Check if the week and year fall into a holiday season
#     is_holiday = any(year_entry["year"] == year and week in year_entry["weeks"] for year_entry in holiday_weeks)
#
#     # Compute fallback mean values for the specific city, product category, and week
#     fallback_vector = weekly_data[
#         (weekly_data['city_rank'] == city_rank_value) &
#         (weekly_data['category_rank'] == category_rank_value) &
#         (weekly_data['week_of_year'] == week)
#     ].mean().to_dict()
#
#     if not fallback_vector:  # Use global mean if no specific fallback is found
#         fallback_vector = weekly_data.iloc[:train_cutoff].mean().to_dict()
#
#     # Create an input vector for prediction
#     input_vector = pd.Series(fallback_vector).copy()
#     input_vector['year'] = year
#     input_vector['week_of_year'] = week
#     input_vector['city_rank'] = city_rank_value
#     input_vector['category_rank'] = category_rank_value
#     input_vector['is_holiday_season'] = 1 if is_holiday else 0
#
#     # Ensure the input vector matches the training feature structure
#     feature_names = weekly_data.drop(columns=['quantity']).columns
#     input_vector = input_vector.reindex(feature_names, fill_value=0).to_frame().T
#
#     # Normalize the input vector
#     input_vector_scaled = scaler.transform(input_vector)
#
#     # Make prediction
#     predicted_quantity = model.predict(input_vector_scaled)[0]
#
#     return {
#         "Year": year,
#         "Week": week,
#         "City": city,
#         "Product Category": product_category,
#         "City Rank": city_rank_value,
#         "Category Rank": category_rank_value,
#         "Is Holiday Season": is_holiday,
#         "Predicted Demand": predicted_quantity
#     }

# Existing imports and model/scaler loading code...

# Load train_cutoff from metadata
with open('model_metadata.pkl', 'rb') as metadata_file:
    metadata = pickle.load(metadata_file)

train_cutoff = metadata["train_cutoff"]

def predict_futuristic_demand_with_holiday_boost(week, year, city, product_category):
    # Fetch city and category ranks
    city_rank_value = city_rank[city_rank['customer_city'] == city]['city_rank'].values[0] \
        if city in city_rank['customer_city'].values else len(city_rank) + 1
    category_rank_value = category_rank[category_rank['product_category_name'] == product_category]['category_rank'].values[0] \
        if product_category in category_rank['product_category_name'].values else len(category_rank) + 1

    # Define holiday season weeks dynamically (from year 2018 to 2024)
    holiday_weeks = [
        {"year": 2018, "weeks": [47, 48, 49, 50, 51, 52]},
        {"year": 2019, "weeks": [8, 19, 24, 27, 47, 48, 49, 50, 51, 52]},
        {"year": 2020, "weeks": [7, 19, 24, 27, 47, 48, 49, 50, 51, 52]},
        {"year": 2021, "weeks": [7, 19, 24, 27, 47, 48, 49, 50, 51, 52]},
        {"year": 2022, "weeks": [8, 19, 24, 27, 47, 48, 49, 50, 51, 52]},
        {"year": 2023, "weeks": [8, 19, 24, 27, 47, 48, 49, 50, 51, 52]},
        {"year": 2024, "weeks": [8, 19, 24, 27, 47, 48, 49, 50, 51, 52]}
    ]

    # Check if the week and year fall into a holiday season
    is_holiday = any(year_entry["year"] == year and week in year_entry["weeks"] for year_entry in holiday_weeks)

    # Compute fallback mean values for the specific city, product category, and week
    fallback_vector = weekly_data[
        (weekly_data['city_rank'] == city_rank_value) &
        (weekly_data['category_rank'] == category_rank_value) &
        (weekly_data['week_of_year'] == week)
    ].mean().to_dict()

    if not fallback_vector:  # Use global mean if no specific fallback is found
        fallback_vector = weekly_data.iloc[:train_cutoff].mean().to_dict()

    # Create an input vector for prediction
    input_vector = pd.Series(fallback_vector).copy()
    input_vector['year'] = year
    input_vector['week_of_year'] = week
    input_vector['city_rank'] = city_rank_value
    input_vector['category_rank'] = category_rank_value
    input_vector['is_holiday_season'] = 1 if is_holiday else 0

    # Ensure the input vector matches the training feature structure
    feature_names = weekly_data.drop(columns=['quantity']).columns
    input_vector = input_vector.reindex(feature_names, fill_value=0).to_frame().T

    # Normalize the input vector
    input_vector_scaled = scaler.transform(input_vector)

    # Make prediction
    predicted_quantity = model.predict(input_vector_scaled)[0]

    return {
        "Year": year,
        "Week": week,
        "City": city,
        "Product Category": product_category,
        "City Rank": city_rank_value,
        "Category Rank": category_rank_value,
        "Is Holiday Season": is_holiday,
        "Predicted Demand": predicted_quantity
    }

