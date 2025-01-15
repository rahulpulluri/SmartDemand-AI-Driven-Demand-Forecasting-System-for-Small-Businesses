import pandas as pd
import numpy as np

# Read the data
df = pd.read_csv('data/business_2/input_6_months_data.csv', parse_dates=[
    'order_purchase_timestamp',
    'order_approved_at',
    'order_delivered_timestamp',
    'order_estimated_delivery_date'
])

# Ensure 'quantity' column starts at 1 if not present
df['quantity'] = df.get('quantity', pd.Series(1, index=df.index))

# Calculate DeliveryDelay if not already present
if 'DeliveryDelay' not in df.columns:
    df['DeliveryDelay'] = (df['order_delivered_timestamp'] - df['order_estimated_delivery_date']).dt.days

# Impact Area 1: Increase quantity based on high DeliveryPriority and delay
impact1_rows = df[(df['DeliveryPriority'] == 1) & (df['DeliveryDelay'] > 0)].copy()
quantity_probs = [0.6, 0.2, 0.1, 0.07, 0.03]
quantity_values = [1, 2, 3, 4, 5]
np.random.seed(42)
df.loc[impact1_rows.index, 'quantity'] = np.random.choice(quantity_values, size=len(impact1_rows), p=quantity_probs)

# Recalculate 'payment_value' for Impact Area 1
df.loc[impact1_rows.index, 'payment_value'] = df.loc[impact1_rows.index, 'price'] * df.loc[impact1_rows.index, 'quantity'] + df.loc[impact1_rows.index, 'shipping_charges']

# Impact Area 2: High Customer Priority
impact2_rows = df[df['CustomerPriority'] == 1].copy()

# Apply discount up to 30% to reduce impact on final payment_value
def apply_discount(price):
    discount = np.random.uniform(0.1, 0.3)
    return price * (1 - discount)

df.loc[impact2_rows.index, 'price'] = impact2_rows['price'].apply(apply_discount)

# Set a higher minimum quantity for priority customers
quantity_probs_impact2 = [0.1, 0.4, 0.3, 0.15, 0.05]
df.loc[impact2_rows.index, 'quantity'] = np.random.choice(quantity_values, size=len(impact2_rows), p=quantity_probs_impact2)

# Recalculate 'payment_value' for Impact Area 2
df.loc[impact2_rows.index, 'payment_value'] = df.loc[impact2_rows.index, 'price'] * df.loc[impact2_rows.index, 'quantity'] + df.loc[impact2_rows.index, 'shipping_charges']

# Impact Area 3: High Seasonal Priority in holiday season
if 'is_holiday_season' not in df.columns:
    df['order_purchase_month'] = df['order_purchase_timestamp'].dt.month
    df['is_holiday_season'] = df['order_purchase_month'].apply(lambda x: 1 if x in [11, 12] else 0)

impact3_rows = df[(df['ProductSeasonalPriority'] == 1) & (df['is_holiday_season'] == 1)].copy()

# Apply a smaller seasonal discount
def apply_seasonal_discount(price):
    discount = np.random.uniform(0.1, 0.25)
    return price * (1 - discount)

df.loc[impact3_rows.index, 'price'] = impact3_rows['price'].apply(apply_seasonal_discount)

# Set quantity to higher values for seasonal items
quantity_probs_impact3 = [0.2, 0.3, 0.25, 0.15, 0.1]
df.loc[impact3_rows.index, 'quantity'] = np.random.choice(quantity_values, size=len(impact3_rows), p=quantity_probs_impact3)

# Recalculate 'payment_value' for Impact Area 3
df.loc[impact3_rows.index, 'payment_value'] = df.loc[impact3_rows.index, 'price'] * df.loc[impact3_rows.index, 'quantity'] + df.loc[impact3_rows.index, 'shipping_charges']

# Drop temporary columns
df.drop(columns=['order_purchase_month'], inplace=True, errors='ignore')

# Save the modified dataset
df.to_csv('data/business_2/modified_6_months_data2.csv', index=False)
