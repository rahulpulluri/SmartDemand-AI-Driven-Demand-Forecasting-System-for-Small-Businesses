import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from xgboost import XGBRegressor
import pickle

# Load the dataset
file_path = 'data/business_1/input_24_months_data.csv'
data = pd.read_csv(file_path, low_memory=False)

# Convert timestamps
data['order_purchase_timestamp'] = pd.to_datetime(data['order_purchase_timestamp'], errors='coerce')
data['order_delivered_timestamp'] = pd.to_datetime(data['order_delivered_timestamp'], errors='coerce')
data['order_estimated_delivery_date'] = pd.to_datetime(data['order_estimated_delivery_date'], errors='coerce')

# Fill missing values for timestamps
for col in ['order_purchase_timestamp', 'order_delivered_timestamp', 'order_estimated_delivery_date']:
    data[col].fillna(data[col].mode()[0], inplace=True)

# Sort data by purchase timestamp
data.sort_values(by='order_purchase_timestamp', inplace=True)

# Define holiday season indicator
def holiday_season_indicator(date):
    month, day, week, weekday = date.month, date.day, date.isocalendar()[1], date.weekday()
    return int((month == 11 and week >= 47) or (month == 12 and day >= 15) or
               (month == 8) or (month == 2 and week == 7) or
               (month == 5 and week == 19) or (month == 6 and week == 24) or
               (month == 7 and week == 27))

data['is_holiday_season'] = data['order_purchase_timestamp'].apply(holiday_season_indicator)

# Calculate delivery delay
data['delivery_delay'] = (data['order_delivered_timestamp'] - data['order_estimated_delivery_date']).dt.days.fillna(0)

# Fill missing numerical values
data['price'].fillna(data['price'].mean(), inplace=True)
data['quantity'].fillna(data['quantity'].mean(), inplace=True)

# Calculate city and category ranks
city_quantity = data.groupby('customer_city')['quantity'].sum().sort_values(ascending=False)
city_rank = pd.DataFrame({
    'customer_city': city_quantity.index,
    'city_rank': range(1, len(city_quantity) + 1)
}).reset_index(drop=True)

category_quantity = data.groupby('product_category_name')['quantity'].sum().sort_values(ascending=False)
category_rank = pd.DataFrame({
    'product_category_name': category_quantity.index,
    'category_rank': range(1, len(category_quantity) + 1)
}).reset_index(drop=True)

# Map ranks back to the main dataset
data = data.merge(city_rank, on='customer_city', how='left')
data = data.merge(category_rank, on='product_category_name', how='left')

# Generate quantity with adjusted logic
np.random.seed(42)
def generate_quantity(row):
    base_quantity = row['price'] * 0.06  # Adjusted weightage for price
    seasonal_boost = 1 + row['ProductSeasonalPriority'] * 0.05
    sales_boost = 1 + row['ProductSalesPriority'] * 0.05
    city_boost = 1 + (11 - row['city_rank']) * 0.02
    return max(1, int(base_quantity * seasonal_boost * sales_boost * city_boost))

data['quantity'] = data.apply(generate_quantity, axis=1)

# Add week and year
data['week_of_year'] = data['order_purchase_timestamp'].dt.isocalendar().week
data['year'] = data['order_purchase_timestamp'].dt.isocalendar().year

# Aggregate weekly data at desired granularity
agg_dict = {
    'quantity': 'sum',
    'price': 'mean',
    'ProductSeasonalPriority': 'mean',
    'ProductSalesPriority': 'mean',
    'delivery_delay': 'mean',
    'is_holiday_season': 'mean',
    'product_weight_g': 'mean',
    'product_length_cm': 'mean',
    'product_height_cm': 'mean',
    'product_width_cm': 'mean'
}
weekly_data = data.groupby(['year', 'week_of_year', 'city_rank', 'category_rank']).agg(agg_dict).reset_index()

# Prepare features and labels
X = weekly_data.drop(columns=['quantity'])
y = weekly_data['quantity']

# Normalize features
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

# Split data (18 months training, 6 months testing)
train_cutoff = int(len(X_scaled) * 0.75)
X_train, X_test = X_scaled[:train_cutoff], X_scaled[train_cutoff:]
y_train, y_test = y[:train_cutoff], y[train_cutoff:]

# Initialize and train the XGBoost model
model = XGBRegressor(
    n_estimators=400,
    learning_rate=0.04,
    max_depth=8,
    subsample=0.85,
    colsample_bytree=0.85,
    random_state=42
)
model.fit(X_train, y_train)

with open('demand_model.pkl', 'wb') as model_file:
    pickle.dump(model, model_file)

with open('scaler.pkl', 'wb') as scaler_file:
    pickle.dump(scaler, scaler_file)

# Save train_cutoff
metadata = {
    "train_cutoff": train_cutoff
}
with open('model_metadata.pkl', 'wb') as metadata_file:
    pickle.dump(metadata, metadata_file)

# Save additional rank mappings for function use
city_rank.to_csv('city_rank.csv', index=False)
category_rank.to_csv('category_rank.csv', index=False)
weekly_data.to_csv('weekly_data.csv', index=False)
