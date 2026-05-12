"""
Heart Disease Advanced Training Script
=======================================
This script fixes the double-scaling bug from the original training code
and trains all 6 models with probability support (including SVM).

Models are saved to: backend/assets/advanced_models/
"""

import pandas as pd
import numpy as np
import joblib
import os

from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import (accuracy_score, precision_score,
                            recall_score, f1_score,
                            confusion_matrix, classification_report)
import matplotlib.pyplot as plt
import seaborn as sns


# ── Paths ──────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(BASE_DIR, 'assets')
OUTPUT_DIR = os.path.join(ASSETS_DIR, 'advanced_models')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ── Load Data ──────────────────────────────────────────────────────────
df = pd.read_csv(os.path.join(ASSETS_DIR, 'train_data.csv'))
dt = pd.read_csv(os.path.join(ASSETS_DIR, 'test_data.csv'))

df = df.drop(columns=['id'])
dt = dt.drop(columns=['id'])


# ── Handle Nulls ───────────────────────────────────────────────────────
train_age_median = df['Age'].median()
train_gender_mode = df['Gender'].mode()[0]
train_work_mode = df['work_type'].mode()[0]
train_smoking_mode = df['smoking_status'].mode()[0]

df['Age'].fillna(train_age_median, inplace=True)
df['Gender'].fillna(train_gender_mode, inplace=True)
df['work_type'].fillna(train_work_mode, inplace=True)
df['smoking_status'].fillna(train_smoking_mode, inplace=True)

dt['Age'].fillna(train_age_median, inplace=True)
dt['work_type'].fillna(train_work_mode, inplace=True)
dt['smoking_status'].fillna(train_smoking_mode, inplace=True)


# ── Encoding ───────────────────────────────────────────────────────────
df['Heart Disease'] = df['Heart Disease'].map({'No': 0, 'Yes': 1})
dt['Heart Disease'] = dt['Heart Disease'].map({'No': 0, 'Yes': 1})

df['Gender'] = df['Gender'].map({'Male': 1, 'Female': 0})
dt['Gender'] = dt['Gender'].map({'Male': 1, 'Female': 0})

# One-hot encode categorical columns
df = pd.get_dummies(df, columns=['smoking_status', 'work_type',
                                  'Chest pain type', 'Slope of ST',
                                  'EKG results', 'Thallium'], drop_first=False)
dt = pd.get_dummies(dt, columns=['smoking_status', 'work_type',
                                  'Chest pain type', 'Slope of ST',
                                  'EKG results', 'Thallium'], drop_first=False)

# Align test columns with train columns
dt = dt.reindex(columns=df.columns, fill_value=0)

# Convert bool columns from get_dummies to int
bool_cols = df.select_dtypes(include='bool').columns
df[bool_cols] = df[bool_cols].astype(int)
dt[bool_cols] = dt[bool_cols].astype(int)


# ── Separate Features & Target ────────────────────────────────────────
X_train = df.drop('Heart Disease', axis=1)
y_train = df['Heart Disease']

X_test = dt.drop('Heart Disease', axis=1)
y_test = dt['Heart Disease']


# ── Outlier Capping (IQR) ─────────────────────────────────────────────
numerical_cols = ['Age', 'BP', 'Cholesterol', 'Max HR', 'ST depression']

for col in numerical_cols:
    Q1 = X_train[col].quantile(0.25)
    Q3 = X_train[col].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    X_train[col] = X_train[col].clip(lower=lower_bound, upper=upper_bound)
    X_test[col] = X_test[col].clip(lower=lower_bound, upper=upper_bound)

print("✅ Outliers capped using IQR method.")


# ── Scaling (SINGLE pass — fixes the double-scaling bug) ──────────────
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print(f"✅ Scaler fitted on {len(scaler.feature_names_in_)} features.")
print(f"   Features: {list(scaler.feature_names_in_)}")


# ── Save Scaler ───────────────────────────────────────────────────────
joblib.dump(scaler, os.path.join(OUTPUT_DIR, 'scaler.pkl'))
print(f"💾 Scaler saved to {OUTPUT_DIR}/scaler.pkl")


# ── Helper: train, evaluate, save ─────────────────────────────────────
def train_and_save(name, model, filename):
    """Train model, print metrics, save to disk."""
    model.fit(X_train_scaled, y_train)
    y_pred = model.predict(X_test_scaled)

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)

    print(f"\n{'='*50}")
    print(f"  {name}")
    print(f"{'='*50}")
    print(f"  Accuracy  : {acc:.4f}")
    print(f"  Precision : {prec:.4f}")
    print(f"  Recall    : {rec:.4f}")
    print(f"  F1-Score  : {f1:.4f}")

    filepath = os.path.join(OUTPUT_DIR, filename)
    joblib.dump(model, filepath)
    print(f"  💾 Saved to {filepath}")

    return model


# ── Train All Models ──────────────────────────────────────────────────

# 1. Logistic Regression
train_and_save(
    "Logistic Regression",
    LogisticRegression(C=1.0, max_iter=1000, random_state=42),
    "logistic_regression.pkl"
)

# 2. Decision Tree
train_and_save(
    "Decision Tree",
    DecisionTreeClassifier(criterion="entropy", random_state=42),
    "decision_tree.pkl"
)

# 3. SVM — with probability=True so predict_proba works
train_and_save(
    "SVM (with probabilities)",
    SVC(kernel='rbf', C=10, gamma='scale', probability=True, random_state=42),
    "svm_model.pkl"
)

# 4. Random Forest
train_and_save(
    "Random Forest",
    RandomForestClassifier(n_estimators=100, random_state=42),
    "rf_model.pkl"
)

# 5. KNN
train_and_save(
    "KNN",
    KNeighborsClassifier(n_neighbors=5),
    "knn_model.pkl"
)

# 6. Gradient Boosting
train_and_save(
    "Gradient Boosting",
    GradientBoostingClassifier(n_estimators=100, random_state=42),
    "gb_model.pkl"
)


print("\n" + "="*50)
print("  ✅ ALL MODELS TRAINED AND SAVED SUCCESSFULLY")
print(f"  📁 Output directory: {OUTPUT_DIR}")
print("="*50)
