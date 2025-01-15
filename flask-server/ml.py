import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from xgboost import XGBRegressor
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Load and preprocess dataset
# data_path = "data/business_1/dataset_refined_clustering_module_done_b1_final.csv"
data_path= "data/business_2/input_24_months_data.csv"
# data_path="data/business_2/input_6_months_data.csv"
# data_path="data/business_3/input_6_months_data.csv"
data = pd.read_csv(data_path, low_memory=False)
data['order_purchase_timestamp'] = pd.to_datetime(data['order_purchase_timestamp'], errors='coerce')
data['order_delivered_timestamp'] = pd.to_datetime(data['order_delivered_timestamp'], errors='coerce')
data['order_estimated_delivery_date'] = pd.to_datetime(data['order_estimated_delivery_date'], errors='coerce')
data.dropna(subset=['order_purchase_timestamp', 'price'], inplace=True)

data = data.sort_values(by='order_purchase_timestamp')


# Define holiday season indicator function
def holiday_season_indicator(date):
    month, day, week, weekday = date.month, date.day, date.isocalendar()[1], date.weekday()
    return int((month == 11 and week >= 47) or (month == 12 and day >= 15) or
               (month == 8) or (month == 2 and week == 7) or
               (month == 5 and week == 19) or (month == 6 and week == 24) or
               (month == 7 and week == 27))

data['is_holiday_season'] = data['order_purchase_timestamp'].apply(holiday_season_indicator)
data['delivery_delay'] = (data['order_delivered_timestamp'] - data['order_estimated_delivery_date']).dt.days.fillna(0)

# Aggregate weekly sales data using ISO weeks
data['week_of_year'] = data['order_purchase_timestamp'].dt.isocalendar().week
data['year'] = data['order_purchase_timestamp'].dt.isocalendar().year

# One-hot encode customer_city, customer_state, and product_category_name
encoder = OneHotEncoder(sparse_output=False, drop='first')
categorical_features = data[['customer_city', 'customer_state', 'product_category_name']]
encoded_features = encoder.fit_transform(categorical_features)
encoded_feature_names = encoder.get_feature_names_out(['customer_city', 'customer_state', 'product_category_name'])

# Add encoded categorical features to DataFrame
encoded_df = pd.DataFrame(encoded_features, columns=encoded_feature_names)
data = pd.concat([data, encoded_df], axis=1)

# Aggregate weekly sales data with new encoded features
agg_dict = {
    'price': 'sum',
    'CustomerPriority': 'mean', 'ProductSeasonalPriority': 'mean', 'ProductSalesPriority': 'mean',
    'DeliveryPriority': 'mean', 'payment_value': 'sum', 'is_holiday_season': 'mean',
    'delivery_delay': 'mean', 'product_weight_g': 'mean',
    'product_length_cm': 'mean', 'product_height_cm': 'mean', 'product_width_cm': 'mean', 'quantity': 'sum'
}
for feature in encoded_feature_names:
    agg_dict[feature] = 'mean'

weekly_sales = data.groupby(['year', 'week_of_year']).agg(agg_dict).reset_index()

# Convert year and week to a datetime format for plotting
weekly_sales['week_start_date'] = pd.to_datetime(weekly_sales['year'].astype(str) + '-W' + weekly_sales['week_of_year'].astype(str) + '-1', format='%G-W%V-%u')

# Apply MinMax scaling
scaler = MinMaxScaler()
# weekly_sales['price_scaled'] = scaler.fit_transform(weekly_sales[['price']])

# Prepare features and labels
feature_columns = ['CustomerPriority', 'ProductSeasonalPriority', 'ProductSalesPriority',
                   'DeliveryPriority', 'is_holiday_season', 'delivery_delay',
                   'product_weight_g', 'product_length_cm', 'product_height_cm', 'product_width_cm', 'quantity'] + list(encoded_feature_names)


X = weekly_sales[feature_columns].values
y = weekly_sales['payment_value'].values

# Train-test split (18 months for training, 6 months for testing)
train_size = int(len(X) * (18 / 24))


# Ensure 'order_purchased_timestamp' is in datetime format
# X['order_purchased_timestamp'] = pd.to_datetime(X['order_purchased_timestamp'])
# y['order_purchased_timestamp'] = pd.to_datetime(y['order_purchased_timestamp'])

# Calculate the cutoff for training (18 months)
# cutoff_date = weekly_sales['order_purchase_timestamp'].min() + pd.DateOffset(months=18)
#
# # Split the dataset X
# weekly_sales_train = weekly_sales[weekly_sales['order_purchase_timestamp'] < cutoff_date]
# weekly_sales_test = weekly_sales[weekly_sales['order_purchase_timestamp'] >= cutoff_date]
#
# X_train = weekly_sales_train[feature_columns].values
# y_train = weekly_sales_train['payment_value'].values
#
# X_test = weekly_sales_test[feature_columns].values
# y_test = weekly_sales_test['payment_value'].values

X_train, X_test = X[:train_size], X[train_size:]
y_train, y_test = y[:train_size], y[train_size:]

# Initialize and train the XGBoost model
model = XGBRegressor(
    n_estimators=300,
    learning_rate=0.05,
    max_depth=6,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42
)
model.fit(X_train, y_train, verbose=True)

# Predict on the test set
y_pred = model.predict(X_test)

# Calculate error metrics and accuracy
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred) * 100  # Model accuracy in %
mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100  # Mean Absolute Percentage Error

print(f'Mean Absolute Error (MAE): {mae:.2f}')
print(f'Root Mean Squared Error (RMSE): {rmse:.2f}')
print(f'Mean Absolute Percentage Error (MAPE): {mape:.2f}%')
print(f'Model Fit Accuracy (R^2 Score): {r2:.2f}%')

# Plot actual vs predicted sales
plt.figure(figsize=(12, 6))
plt.plot(weekly_sales['week_start_date'][-len(y_test):], y_test, label='Actual Sales', color='blue')
plt.plot(weekly_sales['week_start_date'][-len(y_test):], y_pred, label='Predicted Sales', color='orange', linestyle='--')
plt.title('Actual vs Predicted Sales for Entire Business with clustering results, product and customer features - XGBoost')
plt.xlabel('Time')
plt.ylabel('Total Sales')
plt.legend()
plt.show()
