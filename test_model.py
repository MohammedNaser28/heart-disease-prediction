import joblib
model = joblib.load('backend/assets/models/svm_model.pkl')
print(type(model))
print(model.get_params())
