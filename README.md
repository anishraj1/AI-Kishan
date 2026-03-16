AI-Kishan (AI-किसान) is an intelligent agricultural assistant that empowers Indian farmers with AI-driven crop price predictions and smart crop planning recommendations — helping them make data-informed decisions, reduce losses, and maximize yield profits.


📌 Table of Contents

Overview
Features
Tech Stack
Project Structure
Getting Started
How It Works
Screenshots
Dataset
Model Performance
API Endpoints
Contributing
License


🌟 Overview
Indian farmers often face two critical challenges:

Unpredictable crop prices — Selling at the wrong time leads to major financial losses.
Poor crop planning — Choosing the wrong crop for a season or region reduces yield and profitability.

AI-Kishan solves both problems using machine learning models trained on historical agricultural data, weather patterns, soil nutrients, and market prices. The system provides:

📈 Smart Pricing Predictions — Forecast future mandi (market) prices for crops.
🌱 Crop Planning Recommendations — Suggest the most profitable and suitable crops based on soil, climate, and region.


✨ Features
💰 Smart Pricing Module

Predict crop prices for the next 7–30 days based on historical mandi data
Region-wise and season-wise price forecasting
Price trend visualization (rising / falling / stable)
MSP (Minimum Support Price) comparison and alerts
Best time-to-sell recommendations

🌿 Crop Planning Module

Crop recommendation based on soil NPK values, pH, temperature, humidity, and rainfall
Season-aware suggestions (Kharif / Rabi / Zaid)
Yield potential estimation
Fertilizer and resource optimization advice
District/State-level crop suitability mapping

📊 Dashboard & Analytics

Historical price charts for major crops
Market trend analysis
Weather integration for local farming conditions
Government scheme information and MSP rates


🛠️ Tech Stack
LayerTechnologyBackendPython, FlaskML / AIScikit-learn, Random Forest, Data ProcessingPandas, NumPyVisualizationMatplotlib, Plotly, Chart.jsFrontendHTML5, CSS3, JavaScript, BootstrapDatabaseSQLite / PostgreSQLDeploymentHeroku / Render / AWS EC2

📁 Project Structure
AI-Kishan/
│
├── app.py                      # Main Flask application entry point
├── requirements.txt            # Python dependencies
├── README.md
│
├── models/
│   ├── crop_recommendation/
│   │   ├── train.py            # Model training script
│   │   ├── model.pkl           # Trained crop recommendation model
│   │   └── scaler.pkl          # Feature scaler
│   └── price_prediction/
│       ├── train.py            # Price prediction training script
│       ├── model.pkl           # Trained price forecasting model
│       └── encoder.pkl         # Label encoder
│
├── data/
│   ├── raw/                    # Raw datasets
│   │   ├── crop_data.csv
│   │   ├── mandi_prices.csv
│   │   └── weather_data.csv
│   └── processed/              # Cleaned and feature-engineered data
│
├── notebooks/
│   ├── EDA_CropPrices.ipynb    # Exploratory data analysis
│   ├── CropRecommendation.ipynb
│   └── PricePrediction.ipynb
│
├── static/
│   ├── css/
│   ├── js/
│   └── images/
│
├── templates/
│   ├── index.html
│   ├── crop_plan.html
│   ├── price_predict.html
│   └── dashboard.html
│
└── utils/
    ├── preprocess.py           # Data preprocessing utilities
    ├── weather_api.py          # Weather API integration
    └── helpers.py

🚀 Getting Started
Prerequisites

Python 3.9 or higher
pip package manager
Git

Installation
bash# 1. Clone the repository
git clone https://github.com/anishraj1/AI-Kishan.git
cd AI-Kishan

# 2. Create a virtual environment
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the Flask application
python app.py
Then open your browser and go to: http://localhost:5000
Environment Variables
Create a .env file in the root directory:
envFLASK_ENV=development
SECRET_KEY=your_secret_key_here
WEATHER_API_KEY=your_openweathermap_api_key
DATABASE_URL=sqlite:///kishan.db

🧠 How It Works
Smart Pricing Prediction
Historical Mandi Data + Weather Trends + Season
            ↓
    Feature Engineering (lag features, rolling averages)
            ↓
    XGBoost / LSTM Model
            ↓
    Price Forecast (7 / 15 / 30 days)
            ↓
    Best Sell Window Recommendation
Key input features:

Crop type and variety
State / District / Market (Mandi)
Historical price data (last 12 months)
Seasonal trends
Rainfall and weather anomalies


Crop Recommendation System
Soil Nutrients (N, P, K) + pH + Climate Data
            ↓
    Normalization & Preprocessing
            ↓
    Random Forest Classifier (99%+ accuracy)
            ↓
    Top 3 Crop Recommendations + Yield Estimates
Key input features:

Nitrogen (N), Phosphorus (P), Potassium (K)
Soil pH level
Temperature and humidity
Rainfall (mm)
State / Region


📸 Screenshots

(Add screenshots of your application here)

Home PageCrop RecommendationPrice PredictionShow ImageShow ImageShow Image

📊 Dataset
DatasetSourceDescriptionCrop Prices (Mandi)data.gov.inWholesale mandi prices across Indian statesCrop RecommendationKaggleSoil NPK, temperature, humidity, rainfall for 22 cropsWeather DataOpenWeatherMap APIReal-time and historical weatherMSP DataMinistry of Agriculture, GoIGovernment MSP rates by crop and year

📈 Model Performance
Crop Recommendation Model
AlgorithmAccuracyRandom Forest99.3%Decision Tree97.8%KNN97.5%Naive Bayes89.6%
Price Prediction Model
MetricValueMAE (Mean Absolute Error)₹48.2/quintalRMSE₹63.7/quintalR² Score0.91

🔌 API Endpoints
MethodEndpointDescriptionGET/Home pagePOST/predict/cropGet crop recommendationPOST/predict/priceGet price forecast for a cropGET/dashboardAnalytics dashboardGET/api/mspGet current MSP ratesGET/api/weather?state=UPGet weather data by state
Example Request — Crop Recommendation
jsonPOST /predict/crop
Content-Type: application/json

{
  "nitrogen": 90,
  "phosphorus": 42,
  "potassium": 43,
  "temperature": 20.87,
  "humidity": 82.00,
  "ph": 6.50,
  "rainfall": 202.93
}
Response:
json{
  "recommended_crops": ["Rice", "Maize", "Jute"],
  "confidence": [0.94, 0.81, 0.72],
  "best_season": "Kharif",
  "estimated_yield": "3.2 tonnes/hectare"
}

Fork the repository
Create a feature branch: git checkout -b feature/your-feature-name
Commit your changes: git commit -m 'Add some feature'
Push to the branch: git push origin feature/your-feature-name
Open a Pull Request

Please make sure to update tests as appropriate and follow the existing code style.

🙌 Acknowledgements

data.gov.in for open agricultural datasets
Kaggle for the crop recommendation dataset
Ministry of Agriculture, Government of India for MSP data
OpenWeatherMap for weather API support


GitHub: @anishraj1
Project: AI-Kishan
