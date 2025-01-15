import pandas as pd
import numpy as np

# Read the data
df = pd.read_csv('data/business_3/input_6_months_data.csv', parse_dates=[
    'order_purchase_timestamp',
    'order_approved_at',
    'order_delivered_timestamp',
    'order_estimated_delivery_date'
])

# # Introduce 'quantity' column, set to 1
# df['quantity'] = 1
#
# # Recalculate 'payment_value' as price * quantity + shipping_charges
# df['payment_value'] = df['price'] * df['quantity'] + df['shipping_charges']

# Impact Area 1: Reduce delivery delay further + favor rows with higher delivery priority
# resulting in increased quantity (max up to 5, higher numbers increasingly rare)

# Calculate DeliveryDelay if not already present
if 'DeliveryDelay' not in df.columns:
    df['DeliveryDelay'] = (df['order_delivered_timestamp'] - df['order_estimated_delivery_date']).dt.days

# Select rows where DeliveryPriority is high and there was a delay
impact1_rows = df[(df['DeliveryPriority'] == 1) & (df['DeliveryDelay'] > 0)].copy()

# Reduce delivery delay by 50%, not less than zero
df.loc[impact1_rows.index, 'DeliveryDelay'] = impact1_rows['DeliveryDelay'] * 0.5
df.loc[df['DeliveryDelay'] < 0, 'DeliveryDelay'] = 0

# Assign quantities (max up to 5, higher numbers increasingly rare)
quantity_probs = [0.6, 0.2, 0.1, 0.07, 0.03]
quantity_values = [1, 2, 3, 4, 5]
np.random.seed(42)
df.loc[impact1_rows.index, 'quantity'] = np.random.choice(
    quantity_values, size=len(impact1_rows), p=quantity_probs
)

# Recalculate 'payment_value'
df.loc[impact1_rows.index, 'payment_value'] = df.loc[impact1_rows.index, 'price'] * df.loc[impact1_rows.index, 'quantity'] + df.loc[impact1_rows.index, 'shipping_charges']

# Impact Area 2: Favor rows with higher Customer priority, reduce price, increase quantity
impact2_rows = df[df['CustomerPriority'] == 1].copy()

# Apply discount up to 50%
def apply_discount(price):
    discount = np.random.uniform(0.1, 0.5)
    return price * (1 - discount)

df.loc[impact2_rows.index, 'price'] = impact2_rows['price'].apply(apply_discount)

# Increase quantity
quantity_probs_impact2 = [0.5, 0.3, 0.15, 0.04, 0.01]
df.loc[impact2_rows.index, 'quantity'] = np.random.choice(
    quantity_values, size=len(impact2_rows), p=quantity_probs_impact2
)

# Recalculate 'payment_value'
df.loc[impact2_rows.index, 'payment_value'] = df.loc[impact2_rows.index, 'price'] * df.loc[impact2_rows.index, 'quantity'] + df.loc[impact2_rows.index, 'shipping_charges']

# Impact Area 3: Favor rows with higher seasonal priority during holiday season
# Reduce price and increase quantity
if 'is_holiday_season' not in df.columns:
    df['order_purchase_month'] = df['order_purchase_timestamp'].dt.month
    df['is_holiday_season'] = df['order_purchase_month'].apply(lambda x: 1 if x in [11, 12] else 0)

impact3_rows = df[(df['ProductSeasonalPriority'] == 1) & (df['is_holiday_season'] == 1)].copy()

# Apply seasonal discount
def apply_seasonal_discount(price):
    discount = np.random.uniform(0.15, 0.4)
    return price * (1 - discount)

df.loc[impact3_rows.index, 'price'] = impact3_rows['price'].apply(apply_seasonal_discount)

# Increase quantity
quantity_probs_impact3 = [0.4, 0.35, 0.15, 0.08, 0.02]
df.loc[impact3_rows.index, 'quantity'] = np.random.choice(
    quantity_values, size=len(impact3_rows), p=quantity_probs_impact3
)

# Recalculate 'payment_value'
df.loc[impact3_rows.index, 'payment_value'] = df.loc[impact3_rows.index, 'price'] * df.loc[impact3_rows.index, 'quantity'] + df.loc[impact3_rows.index, 'shipping_charges']

# Remove temporary columns
df.drop(columns=['order_purchase_month'], inplace=True, errors='ignore')

# Save the modified dataset
df.to_csv('data/business_3/modified_6_months_data.csv', index=False)