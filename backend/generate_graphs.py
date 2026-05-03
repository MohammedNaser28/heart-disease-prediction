import pandas as pd
import joblib
import os
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(BASE_DIR, 'assets')
GRAPHS_DIR = os.path.join(ASSETS_DIR, 'graphs')

os.makedirs(GRAPHS_DIR, exist_ok=True)

# 1. Load the models and scaler
try:
    svm_model = joblib.load(os.path.join(ASSETS_DIR, 'models', 'svm_model.pkl'))
    tree_model = joblib.load(os.path.join(ASSETS_DIR, 'models', 'decision_tree.pkl'))
    lr_model = joblib.load(os.path.join(ASSETS_DIR, 'models', 'logistic_regression.pkl'))
    scaler = joblib.load(os.path.join(ASSETS_DIR, 'models', 'scaler.pkl'))
except FileNotFoundError as e:
    print(f"Error loading models: {e}")
    exit(1)

# 2. Process the test dataset to get X_test and y_test
print("Loading test dataset...")
dt = pd.read_csv(os.path.join(ASSETS_DIR, 'test_data.csv'))

# Drop ID
dt = dt.drop(columns=['id'])

# Handle Nulls using medians/modes (hardcoded here based on typical train data for simplicity since we just want the graph shape)
dt['Age'].fillna(55, inplace=True)
dt['work_type'].fillna('Private', inplace=True)
dt['smoking_status'].fillna('never smoked', inplace=True)

# Encoding
dt['Heart Disease'] = dt['Heart Disease'].map({'No': 0, 'Yes': 1})
dt['Gender'] = dt['Gender'].map({'Male': 1, 'Female': 0})
dt = pd.get_dummies(dt, columns=['smoking_status', 'work_type'], drop_first=False)

# Ensure columns match training exactly
expected_cols = [
    'Age', 'Gender', 'Chest pain type', 'BP', 'Cholesterol', 
    'FBS over 120', 'EKG results', 'Max HR', 'Exercise angina', 
    'ST depression', 'Slope of ST', 'Number of vessels fluro', 
    'Thallium', 'smoking_status_Unknown', 'smoking_status_formerly smoked', 
    'smoking_status_never smoked', 'smoking_status_smokes', 
    'work_type_Govt_job', 'work_type_Private', 'work_type_Self-employed', 
    'work_type_children'
]

dt = dt.reindex(columns=expected_cols + ['Heart Disease'], fill_value=0)

bool_cols = dt.select_dtypes(include='bool').columns
dt[bool_cols] = dt[bool_cols].astype(int)

X_test = dt.drop('Heart Disease', axis=1)
y_test = dt['Heart Disease']

# 3. Scale numerical features
X_test_scaled = scaler.transform(X_test)

def generate_confusion_matrix(model, model_name, filename):
    plt.style.use('dark_background')
    y_pred = model.predict(X_test_scaled)
    cm = confusion_matrix(y_test, y_pred)
    
    group_names = ['True Negative', 'False Positive', 'False Negative', 'True Positive']
    group_counts = [str(value) for value in cm.flatten()]
    labels = [f"{v1}\n{v2}" for v1, v2 in zip(group_names, group_counts)]
    labels = np.asarray(labels).reshape(2, 2)

    fig, ax = plt.subplots(figsize=(6, 6))
    sns.heatmap(cm, annot=labels, fmt='', cmap='viridis', cbar=False, 
                xticklabels=['No Disease', 'Disease'], yticklabels=['No Disease', 'Disease'], 
                ax=ax, annot_kws={"size": 12, "weight": "bold"})

    plt.title(f"{model_name} Confusion Matrix", pad=15, fontsize=14, fontweight='bold')
    plt.xlabel('Predicted Label', fontsize=12)
    plt.ylabel('True Label', fontsize=12)
    plt.tight_layout()
    
    save_path = os.path.join(GRAPHS_DIR, filename)
    plt.savefig(save_path, facecolor=fig.get_facecolor(), transparent=True)
    plt.close()
    print(f"Saved {filename}")

# Generate for all three
print("Generating graphs...")
generate_confusion_matrix(svm_model, "SVM", "svm_cm.png")
generate_confusion_matrix(tree_model, "Decision Tree", "tree_cm.png")
generate_confusion_matrix(lr_model, "Logistic Regression", "lr_cm.png")

print("All graphs generated successfully in backend/assets/graphs/")
