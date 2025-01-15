import pandas as pd
import matplotlib.pyplot as plt

# Load modified and original data
df = pd.read_csv('data/business_1/modified_6_months_data2.csv', parse_dates=['order_purchase_timestamp'])
original_df = pd.read_csv('data/business_1/input_6_months_data.csv', parse_dates=['order_purchase_timestamp'])

# Merge the original and modified data on 'order_purchase_timestamp' for easier handling
merged_df = pd.merge(
    original_df[['order_purchase_timestamp', 'payment_value']],
    df[['order_purchase_timestamp', 'DeliveryPriority', 'CustomerPriority', 'ProductSeasonalPriority', 'is_holiday_season', 'payment_value']],
    on='order_purchase_timestamp',
    suffixes=('_original', '_modified'),
    how='outer'
).fillna(0)  # Fill NaNs to prevent missing data

# Define feature sets with conditions
feature_sets = [
    {"name": "Impact Area 1", "condition": (merged_df['DeliveryPriority'] == 1)},
    {"name": "Impact Area 2", "condition": (merged_df['CustomerPriority'] == 1)},
    {"name": "Impact Area 3", "condition": (merged_df['ProductSeasonalPriority'] == 1) & (merged_df['is_holiday_season'] == 1)},
    {"name": "All Impact Areas", "condition": (merged_df['DeliveryPriority'] == 1) | (merged_df['CustomerPriority'] == 1) | (merged_df['ProductSeasonalPriority'] == 1)}
]

# Generate each graph
for i, feature_set in enumerate(feature_sets, 1):
    # Create a new column to hold payment values based on the condition
    merged_df[f'payment_value_{feature_set["name"]}'] = merged_df.apply(
        lambda row: row['payment_value_modified'] if feature_set["condition"][row.name] else row['payment_value_original'],
        axis=1
    )

    # Resample the new payment column for smoother trend lines
    trend_data = merged_df.set_index('order_purchase_timestamp')[f'payment_value_{feature_set["name"]}']
    trend_data_resampled = trend_data.resample('W').sum().reset_index()

    # Plot graph
    plt.figure(figsize=(10, 6))
    plt.plot(trend_data_resampled['order_purchase_timestamp'], trend_data_resampled[f'payment_value_{feature_set["name"]}'], label=f'{feature_set["name"]} Payment', color='orange')
    plt.plot(merged_df.set_index('order_purchase_timestamp')['payment_value_original'].resample('W').sum().reset_index()['order_purchase_timestamp'],
             merged_df.set_index('order_purchase_timestamp')['payment_value_original'].resample('W').sum().reset_index()['payment_value_original'],
             label='Original Payment', color='blue')

    plt.title(f"Graph {i}: {feature_set['name']}")
    plt.xlabel('Order Purchase Timestamp')
    plt.ylabel('Sum of Payment Value (Weekly)')
    plt.legend()
    plt.show()
