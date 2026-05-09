import pandas as pd

def prepare_patient_data(raw_json: dict) -> pd.DataFrame:
    """
    Converts the frontend JSON payload into a DataFrame with exactly the 30 columns
    expected by the trained models, in the exact order they were trained on.
    
    The training notebook one-hot encoded: smoking_status, work_type,
    Chest pain type, Slope of ST, EKG results, and Thallium.
    It also double-scaled the numerical features (Age, BP, Cholesterol, Max HR,
    ST depression), so we must apply the first scaling step here before the
    production scaler applies the second.
    """
    
    # Pre-scale numerical features to match the first StandardScaler pass
    # during training (the production scaler.pkl applies the second pass)
    num_stats = {
        'Age': {'mean': 54.558035714285715, 'std': 9.163019020505908},
        'BP': {'mean': 130.29017857142858, 'std': 16.82686765170845},
        'Cholesterol': {'mean': 246.51116071428572, 'std': 45.94929863535801},
        'Max HR': {'mean': 149.29017857142858, 'std': 23.64319390068218},
        'ST depression': {'mean': 1.0205357142857143, 'std': 1.1013496908709934},
    }
    
    # Parse raw input values
    chest_pain = str(raw_json.get('chestPainType', '0'))
    ekg = str(raw_json.get('ekgResults', '0'))
    slope = str(raw_json.get('slopeOfSt', '0'))
    thallium = str(raw_json.get('thallium', '0'))
    
    data = {
        # --- Numerical (pre-scaled) ---
        'Age': [(float(raw_json.get('age', 0)) - num_stats['Age']['mean']) / num_stats['Age']['std']],
        'Gender': [1 if raw_json.get('gender') == 'Male' else 0],
        
        # --- Chest pain type one-hot (values: 1, 2, 3, 4) ---
        'Chest pain type_1': [1 if chest_pain == '1' else 0],
        'Chest pain type_2': [1 if chest_pain == '2' else 0],
        'Chest pain type_3': [1 if chest_pain == '3' else 0],
        'Chest pain type_4': [1 if chest_pain == '4' else 0],
        
        # --- Numerical (pre-scaled) ---
        'BP': [(float(raw_json.get('bp', 0)) - num_stats['BP']['mean']) / num_stats['BP']['std']],
        'Cholesterol': [(float(raw_json.get('cholesterol', 0)) - num_stats['Cholesterol']['mean']) / num_stats['Cholesterol']['std']],
        'FBS over 120': [1 if raw_json.get('fbs') == '>120 mg/dL' else 0],
        
        # --- EKG results one-hot (values: 0, 1, 2) ---
        'EKG results_0': [1 if ekg == '0' else 0],
        'EKG results_1': [1 if ekg == '1' else 0],
        'EKG results_2': [1 if ekg == '2' else 0],
        
        # --- Numerical (pre-scaled) ---
        'Max HR': [(float(raw_json.get('maxHr', 0)) - num_stats['Max HR']['mean']) / num_stats['Max HR']['std']],
        'Exercise angina': [int(raw_json.get('exerciseAngina', 0))],
        'ST depression': [(float(raw_json.get('stDepression', 0)) - num_stats['ST depression']['mean']) / num_stats['ST depression']['std']],
        
        # --- Slope of ST one-hot (values: 1, 2, 3) ---
        'Slope of ST_1': [1 if slope == '1' else 0],
        'Slope of ST_2': [1 if slope == '2' else 0],
        'Slope of ST_3': [1 if slope == '3' else 0],
        
        'Number of vessels fluro': [int(raw_json.get('numVesselsFluro', 0))],
        
        # --- Thallium one-hot (values: 3, 6, 7) ---
        'Thallium_3': [1 if thallium == '3' else 0],
        'Thallium_6': [1 if thallium == '6' else 0],
        'Thallium_7': [1 if thallium == '7' else 0],
        
        # --- work_type one-hot ---
        'work_type_Govt_job': [0],
        'work_type_Private': [0],
        'work_type_Self-employed': [0],
        'work_type_children': [0],
        
        # --- smoking_status one-hot ---
        'smoking_status_Unknown': [0],
        'smoking_status_formerly smoked': [0],
        'smoking_status_never smoked': [0],
        'smoking_status_smokes': [0],
    }
    
    # Set one-hot encoded columns based on selected options
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
        
    # Create DataFrame with strictly enforced column order (must match training)
    # pd.get_dummies keeps non-dummied columns in place, then APPENDS dummies
    # at the end in the order of the columns= parameter from training:
    # columns=['smoking_status', 'work_type', 'Chest pain type', 'Slope of ST', 'EKG results', 'Thallium']
    cols = [
        # Non-dummied columns (original order after drop 'id')
        'Age', 'Gender', 'BP', 'Cholesterol', 'FBS over 120',
        'Max HR', 'Exercise angina', 'ST depression', 'Number of vessels fluro',
        # Dummies appended in order of columns= parameter
        'smoking_status_Unknown', 'smoking_status_formerly smoked',
        'smoking_status_never smoked', 'smoking_status_smokes',
        'work_type_Govt_job', 'work_type_Private', 'work_type_Self-employed', 'work_type_children',
        'Chest pain type_1', 'Chest pain type_2', 'Chest pain type_3', 'Chest pain type_4',
        'Slope of ST_1', 'Slope of ST_2', 'Slope of ST_3',
        'EKG results_0', 'EKG results_1', 'EKG results_2',
        'Thallium_3', 'Thallium_6', 'Thallium_7',
    ]
    return pd.DataFrame(data, columns=cols)