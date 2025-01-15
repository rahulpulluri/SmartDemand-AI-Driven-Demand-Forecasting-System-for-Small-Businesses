import math

import pandas as pd
import numpy as np
import sys


def main():

    input_file = "data/business_2/dataset_refined_clustering_module_done_b1_final.csv"
    output_file = "data/business_2/input_24_months_data.csv"

    try:
        # Read the CSV file
        # df = pd.read_csv(input_file, low_memory=False)

        df = pd.read_csv(input_file, parse_dates=[
            'order_purchase_timestamp',
            'order_approved_at',
            'order_delivered_timestamp',
            'order_estimated_delivery_date'
        ], low_memory=False)

        # Introduce 'quantity' column, set to 1
        df['quantity'] = 1

        # Recalculate 'payment_value' as price * quantity + shipping_charges
        df['payment_value'] = df['price'] * df['quantity'] + df['shipping_charges']

        print(df.head())

        total_rows = len(df)
        print(f"Total number of rows in the original DataFrame: {total_rows}")

        # # Calculate the number of rows per split
        # split_size = math.ceil(total_rows / 4)
        # print(f"Each split will have approximately {split_size} rows.")
        #
        # # Get the start and end indices for the fourth split
        # start_idx = split_size * 3
        # end_idx = total_rows
        #
        # # Slice the DataFrame for the fourth split
        # df_fourth_part = df.iloc[start_idx:end_idx]
        # print(f"Number of rows in the fourth split: {len(df_fourth_part)}")

        # Ensure 'order_purchase_timestamp' is in datetime format
        df['order_purchase_timestamp'] = pd.to_datetime(df['order_purchase_timestamp'])

        # Sort by 'order_purchase_timestamp'
        df = df.sort_values(by='order_purchase_timestamp')

        # Write the fourth part to the output CSV file
        df.to_csv(output_file, index=False)
        print(f"The fourth portion of the dataset has been written to {output_file}.")

    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
