import pandas as pd
import glob

# Folder containing the CSV files
input_folder = 'data/business_all/'  # Replace with the path to your CSV files
output_file = 'data/business_2/input_24_months_data.csv'  # Name of the output file


def combine_and_sort_csv(input_folder, output_file):
    # Use glob to find all CSV files in the folder
    csv_files = glob.glob(f"{input_folder}/*.csv")

    # List to hold data from all files
    combined_data = []

    for file in csv_files:
        # Read each CSV file into a DataFrame
        df = pd.read_csv(file)
        combined_data.append(df)

    # Concatenate all DataFrames
    combined_df = pd.concat(combined_data, ignore_index=True)

    # Ensure 'order_purchase_timestamp' is in datetime format
    combined_df['order_purchase_timestamp'] = pd.to_datetime(combined_df['order_purchase_timestamp'])

    # Sort by 'order_purchase_timestamp'
    combined_df = combined_df.sort_values(by='order_purchase_timestamp')

    # Write the combined and sorted data to a new CSV file
    combined_df.to_csv(output_file, index=False)
    print(f"Combined and sorted data written to: {output_file}")


# Call the function
combine_and_sort_csv(input_folder, output_file)