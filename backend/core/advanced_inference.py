import joblib
import pandas as pd
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(BASE_DIR, 'assets')

ADVANCED_MODELS = {}
ADVANCED_SCALER = None
ADVICE_DB = {}


def load_advanced_artifacts():
    """
    Loads all advanced model .pkl files and the advice database into memory.
    """
    global ADVANCED_MODELS, ADVANCED_SCALER, ADVICE_DB

    models_dir = os.path.join(ASSETS_DIR, 'advanced_models')

    try:
        ADVANCED_MODELS["logistic"] = joblib.load(os.path.join(models_dir, 'logistic_regression.pkl'))
        ADVANCED_MODELS["tree"] = joblib.load(os.path.join(models_dir, 'decision_tree.pkl'))
        ADVANCED_MODELS["svm"] = joblib.load(os.path.join(models_dir, 'svm_model.pkl'))
        ADVANCED_MODELS["random_forest"] = joblib.load(os.path.join(models_dir, 'rf_model.pkl'))
        ADVANCED_MODELS["knn"] = joblib.load(os.path.join(models_dir, 'knn_model.pkl'))
        ADVANCED_MODELS["gboost"] = joblib.load(os.path.join(models_dir, 'gb_model.pkl'))

        ADVANCED_SCALER = joblib.load(os.path.join(models_dir, 'scaler.pkl'))
        print("✅ Advanced Models and Scaler loaded!")
    except FileNotFoundError as e:
        print(f"⚠️ Advanced models not yet available: {e}")
        print("   Run Heart_disease_advanced.py to generate them.")

    # Load advice database
    advice_path = os.path.join(ASSETS_DIR, 'advice_db.json')
    try:
        with open(advice_path, 'r') as f:
            ADVICE_DB = json.load(f)
        print(f"✅ Advice DB loaded with {len(ADVICE_DB)} entries.")
    except FileNotFoundError:
        print("⚠️ advice_db.json not found.")


def _evaluate_risk_factors(raw_json: dict) -> list:
    """
    Checks the raw patient input values against medical thresholds
    defined in advice_db.json and returns a list of flagged risk factors.
    """
    flagged = []

    for key, entry in ADVICE_DB.items():
        field = entry.get("field")
        compare = entry.get("compare")
        threshold = entry.get("threshold")
        raw_value = raw_json.get(field)

        if raw_value is None:
            continue

        triggered = False

        if compare == "gte":
            try:
                triggered = float(raw_value) >= float(threshold)
            except (ValueError, TypeError):
                continue
        elif compare == "lte":
            try:
                triggered = float(raw_value) <= float(threshold)
            except (ValueError, TypeError):
                continue
        elif compare == "eq":
            triggered = str(raw_value) == str(threshold)

        if triggered:
            # Build display value
            unit = entry.get("unit") or ""
            try:
                display_val = f"{float(raw_value):.0f} {unit}".strip()
            except (ValueError, TypeError):
                display_val = str(raw_value)

            flagged.append({
                "factor": entry["factor"],
                "value": display_val,
                "advice": entry["advice"]
            })

    return flagged


def run_advanced_prediction(processed_df: pd.DataFrame, model_type: str, raw_json: dict):
    """
    Runs prediction using the advanced models and returns enriched results
    with risk level and personalized advice.
    """
    if not ADVANCED_MODELS:
        raise RuntimeError("Advanced models are not loaded. Run the training script first.")

    if model_type not in ADVANCED_MODELS:
        raise ValueError(f"Model '{model_type}' is not supported.")

    if ADVANCED_SCALER is None:
        raise RuntimeError("Advanced scaler is not loaded.")

    selected_model = ADVANCED_MODELS[model_type]

    # Scale features
    scaled_features = ADVANCED_SCALER.transform(processed_df)

    # Predict
    prediction = int(selected_model.predict(scaled_features)[0])

    # Get probability
    probability = None
    if hasattr(selected_model, "predict_proba"):
        probability = float(selected_model.predict_proba(scaled_features)[0][1])

    # Determine risk level
    if prediction == 1:
        risk_level = "high"
    elif probability is not None:
        if probability >= 0.3:
            risk_level = "borderline"
        else:
            risk_level = "low"
    else:
        risk_level = "low"

    # Evaluate risk factors from raw input values
    risk_factors = _evaluate_risk_factors(raw_json)

    return {
        "prediction": prediction,
        "probability": probability,
        "risk_level": risk_level,
        "risk_factors": risk_factors
    }
