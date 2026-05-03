import joblib
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(BASE_DIR, 'assets')


MODELS = {}
SCALER = None

def load_artifacts():
    """
    Loads all .pkl files into the global memory dictionaries.
    """
    global MODELS, SCALER
    
    try:
        MODELS["logistic"] = joblib.load(os.path.join(ASSETS_DIR, 'models', 'logistic_regression.pkl'))
        MODELS["tree"] = joblib.load(os.path.join(ASSETS_DIR, 'models', 'decision_tree.pkl'))
        MODELS["svm"] = joblib.load(os.path.join(ASSETS_DIR, 'models', 'svm_model.pkl'))
        MODELS["random_forest"] = joblib.load(os.path.join(ASSETS_DIR, 'models', 'random_forest.pkl'))
        MODELS["knn"] = joblib.load(os.path.join(ASSETS_DIR, 'models', 'knn_model.pkl'))
        MODELS["gboost"] = joblib.load(os.path.join(ASSETS_DIR, 'models', 'gb_model.pkl'))

        SCALER = joblib.load(os.path.join(ASSETS_DIR, 'models', 'scaler.pkl'))
        print("✅ Models and Scaler successfully loaded into memory!")
    except FileNotFoundError as e:
        print(f"❌ Error loading artifacts: {e}")
        print("Make sure your .pkl files are in the backend/assets/ folder.")

def run_prediction(processed_df: pd.DataFrame, model_type: str):
    """
    Passes the cleaned and scaled DataFrame to the requested model.
    """
    if model_type not in MODELS:
        raise ValueError(f"Model '{model_type}' is not supported.")
    
    selected_model = MODELS[model_type]
    
    if SCALER is None:
        raise RuntimeError("Scaler is not loaded into memory.")
        
    scaled_features = SCALER.transform(processed_df)

    prediction = int(selected_model.predict(scaled_features)[0])

    probability = None
    if hasattr(selected_model, "predict_proba"):
        probability = float(selected_model.predict_proba(scaled_features)[0][1])
        
    return {
        "prediction": prediction,
        "probability": probability
    }