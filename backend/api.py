from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from core.processing import prepare_patient_data
from core.inference import load_artifacts, run_prediction

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
GRAPHS_DIR = os.path.join(BASE_DIR, "assets", "graphs")

# Mount the graphs directory so the React app can load images directly via HTTP
app.mount("/graphs", StaticFiles(directory=GRAPHS_DIR), name="graphs")

@app.on_event("startup")
async def startup_event():
    load_artifacts()

@app.post("/predict")
async def predict_heart_disease(patient_json: dict):
    try:
        model_type = patient_json.get("model", "svm")
        
        # 1. Convert incoming JSON to the exact DataFrame expected by the models
        df = prepare_patient_data(patient_json)
        
        # 2. Run inference (this scales the data internally)
        results = run_prediction(df, model_type)
        print("results",results)
        return results
    except Exception as e:
        return {"error": str(e)}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/models")
async def get_models():
    return {"models": ["logistic", "tree", "svm","random_forest", "knn", "gboost"]}