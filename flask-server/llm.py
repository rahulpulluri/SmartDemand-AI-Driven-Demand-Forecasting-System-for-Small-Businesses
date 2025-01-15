from openai import OpenAI, OpenAIError
from flask import Blueprint, request, jsonify
import requests
from dotenv import load_dotenv
import os
from fuzzywuzzy import process

# Load environment variables
load_dotenv()

llm_bp = Blueprint("llm", __name__, url_prefix="/api")

client = OpenAI(
    # defaults to os.environ.get("OPENAI_API_KEY")
    api_key=os.getenv("OPENAI_API_KEY"),
)

# Set OpenAI API key
# openai.api_key = os.getenv("OPENAI_API_KEY")

# Define keywords and mapping for queries
QUERY_KEYWORDS = {
    "sales trend": "monthly-sales-trend",
    "average price by category": "average-price-category",
    "order status distribution": "order-status-distribution",
    "top customer locations": "top-locations",
    "high delivery priority with delay": "impact/graph1",
    "high customer priority": "impact/graph2",
    "high seasonal priority": "impact/graph3",
    "all impact areas": "impact/graph4",
    "top customers by payment": "top-customers-by-payment",
    "payment type distribution": "payment-type-distribution",
    "smartdemand": "smart-demand-info",
}

# Mock response for SmartDemand in case the API fails
SMART_DEMAND_RESPONSE = {
    "description": "SmartDemand is a business intelligence tool designed to optimize demand forecasting and resource allocation. It uses advanced analytics to improve efficiency and customer satisfaction.",
    "features": [
        "Accurate demand forecasting",
        "Real-time data analytics",
        "Improved resource management",
        "Customer behavior insights",
        "Streamlined operations",
    ],
}


# Fetch data from the appropriate API
def fetch_business_insights(user_query):
    try:
        # Match the query to the best keyword
        matched_query, score = process.extractOne(user_query.lower(), QUERY_KEYWORDS.keys())

        if score > 70:  # Ensure a good match (adjust threshold as needed)
            api_endpoint = QUERY_KEYWORDS[matched_query]
            # Mock SmartDemand data if endpoint fails
            if api_endpoint == "smart-demand-info":
                return SMART_DEMAND_RESPONSE
            return requests.get(f"http://127.0.0.1:5000/api/{api_endpoint}").json()
        else:
            return None
    except Exception as e:
        print(f"Error fetching data from API: {e}")
        return None


@llm_bp.route("/chat", methods=["POST"])
def chat():
    try:
        # Parse user input
        data = request.json
        user_query = data.get("prompt", "").strip()

        if not user_query:
            return jsonify({"reply": "Please provide a valid query."}), 400

        # Fetch relevant data
        business_data = fetch_business_insights(user_query)

        if business_data:
            # Construct dynamic prompt for OpenAI
            llm_prompt = f"""
            You are an intelligent assistant analyzing business data. Below is the dataset:
            {business_data}

            The user asked: "{user_query}"

            Provide a detailed, human-like analysis of the data to answer their query. Include key trends and insights.
            """
        else:
            # Fallback for non-data or out-of-scope queries
            if any(keyword in user_query.lower() for keyword in QUERY_KEYWORDS.keys()):
                llm_prompt = f"""
                You are a knowledgeable assistant. Unfortunately, the requested data is unavailable at the moment.
                The user asked: "{user_query}"

                Apologize and suggest trying again later.
                """
            else:
                llm_prompt = f"""
                You are a helpful assistant focused on business insights. The user asked:
                "{user_query}"

                Kindly respond that this query is outside the scope of your expertise, as you only assist with business metrics and trends.
                """

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": llm_prompt},
            ],
        )

        reply = response.choices[0].message.content
        return jsonify({"reply": reply})

    except OpenAIError as e:
        print(f"OpenAI API error: {str(e)}")
        return jsonify({"error": "An error occurred with the OpenAI API."}), 500
    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({"error": "Something went wrong on the server."}), 500
