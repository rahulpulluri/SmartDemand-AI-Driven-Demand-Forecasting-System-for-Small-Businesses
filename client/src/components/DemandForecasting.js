import React, { useState, useEffect } from "react";
import axios from "axios";

const DemandForecasting = () => {
  const [year, setYear] = useState("");
  const [week, setWeek] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [city, setCity] = useState("");
  const [productOptions, setProductOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [result, setResult] = useState(null);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [samples] = useState([
    {
      Year: 2018,
      Week: 34,
      City: "rio de janeiro",
      "Product Category": "health_beauty",
    },
    {
      Year: 2018,
      Week: 33,
      City: "sao paulo",
      "Product Category": "electronics",
    },
    { Year: 2018, Week: 29, City: "sao paulo", "Product Category": "toys" },
  ]);

  useEffect(() => {
    fetchOptions(
      "product-categories",
      "",
      setProductOptions,
      setLoadingProducts
    );
    fetchOptions("cities", "", setCityOptions, setLoadingCities);
  }, []);

  const fetchOptions = async (endpoint, query, setOptions, setLoading) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_AUTH_API_ENDPOINT}/${endpoint}?query=${
          query || ""
        }`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setOptions(response.data || []);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    setErrorMessage("");
    e?.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_AUTH_API_ENDPOINT}/demand-forecast`,
        { year, week, productCategory, city },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setResult(response.data);
    } catch (error) {
      console.error("Error fetching demand:", error);
      setErrorMessage(
        "Failed to fetch demand forecast as there is no data available for the selected parameters. To predict future demand, please select 2019 and beyond."
      );
      setResult(null);
    }
  };

  const sendSample = (sample) => {
    setYear(sample.Year);
    setWeek(sample.Week);
    setCity(sample.City);
    setProductCategory(sample["Product Category"]);
  };

  const getWeekHint = (weekNumber) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthIndex = Math.floor((weekNumber - 1) * (12 / 52));
    const weekWithinMonth = ((weekNumber - 1) % 4) + 1;
    return `Week ${weekWithinMonth} of ${monthNames[monthIndex]}`;
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white p-6 shadow-md rounded-lg flex gap-6">
      {/* Form Section */}
      <div className="flex-1 flex flex-col">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4 text-center">
          Demand Forecasting
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Year Dropdown */}
          <div>
            <label
              htmlFor="year"
              className="block text-gray-700 font-medium mb-2"
            >
              Year
            </label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="" disabled>
                Select year
              </option>
              {[...Array(2024 - 2016 + 1)].map((_, i) => (
                <option key={i} value={2016 + i}>
                  {2016 + i}
                </option>
              ))}
            </select>
          </div>

          {/* Week Dropdown */}
          <div>
            <label
              htmlFor="week"
              className="block text-gray-700 font-medium mb-2"
            >
              Week of Year
            </label>
            <select
              id="week"
              value={week}
              onChange={(e) => setWeek(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="" disabled>
                Select week
              </option>
              {[...Array(52)].map((_, i) => (
                <option key={i} value={i + 1}>
                  Week {i + 1}
                </option>
              ))}
            </select>
            {week && (
              <p className="text-sm text-gray-500 mt-1">{getWeekHint(week)}</p>
            )}
          </div>

          {/* Product Category */}
          <div>
            <label
              htmlFor="productCategory"
              className="block text-gray-700 font-medium mb-2"
            >
              Product Category
            </label>
            <input
              type="text"
              id="productCategory"
              value={productCategory}
              onChange={(e) => {
                setProductCategory(e.target.value);
                fetchOptions(
                  "product-categories",
                  e.target.value,
                  setProductOptions,
                  setLoadingProducts
                );
              }}
              onFocus={() => setShowProductDropdown(true)}
              onBlur={() =>
                setTimeout(() => setShowProductDropdown(false), 200)
              }
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Search product category"
            />
            {loadingProducts && (
              <p className="text-sm text-gray-500 mt-1">Loading...</p>
            )}
            {showProductDropdown && (
              <ul className="absolute bg-white shadow-md rounded-md mt-1 z-10 max-h-40 overflow-y-auto w-full">
                {productOptions.map((option) => (
                  <li
                    key={option}
                    onClick={() => {
                      setProductCategory(option);
                      setShowProductDropdown(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-purple-100"
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block text-gray-700 font-medium mb-2"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                fetchOptions(
                  "cities",
                  e.target.value,
                  setCityOptions,
                  setLoadingCities
                );
              }}
              onFocus={() => setShowCityDropdown(true)}
              onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Search city"
            />
            {loadingCities && (
              <p className="text-sm text-gray-500 mt-1">Loading...</p>
            )}
            {showCityDropdown && (
              <ul className="absolute bg-white shadow-md rounded-md mt-1 z-10 max-h-40 overflow-y-auto w-full">
                {cityOptions.map((option) => (
                  <li
                    key={option}
                    onClick={() => {
                      setCity(option);
                      setShowCityDropdown(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-purple-100"
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 text-white p-2 rounded-md hover:bg-purple-600 transition-colors"
          >
            Get Demand
          </button>
        </form>

        {/* Output Section */}
        {result && (
          <div className="mt-6 p-4 bg-gray-50 border rounded-md">
            {result.actual_demand ? (
              <p className="text-gray-800">
                <strong>Predicted and Actual Demand:</strong>
                <br />
                <br />
                The predicted demand for{" "}
                <strong>{result.predicted_demand} units</strong> of the product
                category <strong>"{productCategory}"</strong> is for the{" "}
                <strong>{getWeekHint(week)}</strong> in the city of{" "}
                <strong>{city}</strong>, {year}.
                <br />
                The actual recorded demand for the same period and inputs is{" "}
                <strong>{result.actual_demand} units</strong>.
              </p>
            ) : (
              <p className="text-gray-800">
                <strong>Predicted Demand (No Actual Data Available):</strong>
                <br />
                <br />
                The predicted demand for{" "}
                <strong>{result.predicted_demand} units</strong> of the product
                category <strong>"{productCategory}"</strong> is for the{" "}
                <strong>{getWeekHint(week)}</strong> in the city of{" "}
                <strong>{city}</strong>, {year}.
              </p>
            )}
          </div>
        )}

        {/* Error Section */}
        {errorMessage && (
          <div className="mt-6 p-4 bg-gray-50 border rounded-md">
            <p className="text-red-600">{errorMessage}</p>
          </div>
        )}
      </div>

      {/* Sample Section */}
      <div className="w-1/3 flex flex-col">
        <h3 className="text-lg font-semibold text-purple-700 mb-4">
          Sample Inputs with Actual Test Data
        </h3>
        <div className="space-y-4">
          {samples.map((sample, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg bg-gray-50 shadow-sm flex flex-col gap-2"
            >
              <p>
                <strong>Year:</strong> {sample.Year}
              </p>
              <p>
                <strong>Week:</strong> {sample.Week}
              </p>
              <p>
                <strong>City:</strong> {sample.City}
              </p>
              <p>
                <strong>Product Category:</strong> {sample["Product Category"]}
              </p>
              <button
                onClick={() => sendSample(sample)}
                className="mt-2 bg-purple-700 text-white px-3 py-1 rounded-md hover:bg-purple-600"
              >
                Use
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemandForecasting;
