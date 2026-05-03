import pandas as pd

def prepare_patient_data(raw_json: dict) -> pd.DataFrame:
    """
    Converts the frontend JSON payload into a DataFrame with exactly the 21 columns
    expected by the trained models in the exact order.
    """
    
    # 1. Map values and initialize one-hot encoded columns
    data = {
        'Age': [float(raw_json.get('age', 0))],
        'Gender': [1 if raw_json.get('gender') == 'Male' else 0],
        'Chest pain type': [int(raw_json.get('chestPainType', 0))],
        'BP': [float(raw_json.get('bp', 0))],
        'Cholesterol': [float(raw_json.get('cholesterol', 0))],
        'FBS over 120': [1 if raw_json.get('fbs') == '>120 mg/dL' else 0],
        'EKG results': [int(raw_json.get('ekgResults', 0))],
        'Max HR': [float(raw_json.get('maxHr', 0))],
        'Exercise angina': [int(raw_json.get('exerciseAngina', 0))],
        'ST depression': [float(raw_json.get('stDepression', 0))],
        'Slope of ST': [int(raw_json.get('slopeOfSt', 0))],
        'Number of vessels fluro': [int(raw_json.get('numVesselsFluro', 0))],
        'Thallium': [int(raw_json.get('thallium', 0))],
        
        # Initialize one-hot encoded columns to 0
        'smoking_status_Unknown': [0],
        'smoking_status_formerly smoked': [0],
        'smoking_status_never smoked': [0],
        'smoking_status_smokes': [0],
        
        'work_type_Govt_job': [0],
        'work_type_Private': [0],
        'work_type_Self-employed': [0],
        'work_type_children': [0]
    }
    
    # 2. Set one-hot encoded columns based on selected options
    smoking_status = raw_json.get('smokingStatus', '')
    if smoking_status == 'Unknown':
        data['smoking_status_Unknown'] = [1]
    elif smoking_status == 'formerly smoked':
        data['smoking_status_formerly smoked'] = [1]
    elif smoking_status == 'never smoked':
        data['smoking_status_never smoked'] = [1]
    elif smoking_status == 'smokes':
        data['smoking_status_smokes'] = [1]
        
    work_type = raw_json.get('workType', '')
    if work_type == 'Govt_job':
        data['work_type_Govt_job'] = [1]
    elif work_type == 'Private':
        data['work_type_Private'] = [1]
    elif work_type == 'Self-employed':
        data['work_type_Self-employed'] = [1]
    elif work_type == 'children':
        data['work_type_children'] = [1]
        
    # 3. Create DataFrame with strictly enforced column order
    cols = [
        'Age', 'Gender', 'Chest pain type', 'BP', 'Cholesterol', 
        'FBS over 120', 'EKG results', 'Max HR', 'Exercise angina', 
        'ST depression', 'Slope of ST', 'Number of vessels fluro', 
        'Thallium', 'smoking_status_Unknown', 'smoking_status_formerly smoked', 
        'smoking_status_never smoked', 'smoking_status_smokes', 
        'work_type_Govt_job', 'work_type_Private', 'work_type_Self-employed', 
        'work_type_children'
    ]
    
    return pd.DataFrame(data, columns=cols)