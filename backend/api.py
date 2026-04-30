from fastapi import FastAPI
from core.processing import clean_patient_data, cap_outliers
import joblib
import pandas as pd

app = FastAPI()
model = joblib.load('assets/heart_disease_model.pkl')
scaler = joblib.load('assets/scaler.pkl')

@app.post("/predict")
async def predict_heart_disease(patient_json: dict):
    # 1. Convert incoming JSON to a DataFrame
    raw_df = pd.DataFrame([patient_json])
    
    # 2. Call the functions from your restructured script[cite: 1]
    cleaned_df = clean_patient_data(raw_df)
    capped_df = cap_outliers(cleaned_df)
    
    # 3. Scale numerical columns[cite: 1]
    numerical_cols = ['Age', 'BP', 'Cholesterol', 'Max HR', 'ST depression']
    capped_df[numerical_cols] = scaler.transform(capped_df[numerical_cols])
    
    # 4. Predict![cite: 1]
    prediction = model.predict(capped_df)
    probability = model.predict_proba(capped_df)[:, 1]
    
    return {
        "prediction": int(prediction[0]),
        "probability": float(probability[0])
    }