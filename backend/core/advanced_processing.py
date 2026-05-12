import pandas as pd

def prepare_advanced_patient_data(raw_json: dict) -> pd.DataFrame:
    """
    Converts the frontend JSON into a DataFrame with exactly the 30 columns
    expected by the advanced models (single-pass scaling — no pre-scaling needed).
    """

    # Parse raw input values for one-hot encoding
    chest_pain = str(raw_json.get('chestPainType', '0'))
    ekg = str(raw_json.get('ekgResults', '0'))
    slope = str(raw_json.get('slopeOfSt', '0'))
    thallium = str(raw_json.get('thallium', '0'))

    data = {
        # Numerical features (raw values — scaler handles everything)
        'Age': [float(raw_json.get('age', 0))],
        'Gender': [1 if raw_json.get('gender') == 'Male' else 0],

        'BP': [float(raw_json.get('bp', 0))],
        'Cholesterol': [float(raw_json.get('cholesterol', 0))],
        'FBS over 120': [1 if raw_json.get('fbs') == '>120 mg/dL' else 0],

        'Max HR': [float(raw_json.get('maxHr', 0))],
        'Exercise angina': [int(raw_json.get('exerciseAngina', 0))],
        'ST depression': [float(raw_json.get('stDepression', 0))],

        'Number of vessels fluro': [int(raw_json.get('numVesselsFluro', 0))],

        # One-hot: smoking_status
        'smoking_status_Unknown': [0],
        'smoking_status_formerly smoked': [0],
        'smoking_status_never smoked': [0],
        'smoking_status_smokes': [0],

        # One-hot: work_type
        'work_type_Govt_job': [0],
        'work_type_Private': [0],
        'work_type_Self-employed': [0],
        'work_type_children': [0],

        # One-hot: Chest pain type (values: 1, 2, 3, 4)
        'Chest pain type_1': [1 if chest_pain == '1' else 0],
        'Chest pain type_2': [1 if chest_pain == '2' else 0],
        'Chest pain type_3': [1 if chest_pain == '3' else 0],
        'Chest pain type_4': [1 if chest_pain == '4' else 0],

        # One-hot: Slope of ST (values: 1, 2, 3)
        'Slope of ST_1': [1 if slope == '1' else 0],
        'Slope of ST_2': [1 if slope == '2' else 0],
        'Slope of ST_3': [1 if slope == '3' else 0],

        # One-hot: EKG results (values: 0, 1, 2)
        'EKG results_0': [1 if ekg == '0' else 0],
        'EKG results_1': [1 if ekg == '1' else 0],
        'EKG results_2': [1 if ekg == '2' else 0],

        # One-hot: Thallium (values: 3, 6, 7)
        'Thallium_3': [1 if thallium == '3' else 0],
        'Thallium_6': [1 if thallium == '6' else 0],
        'Thallium_7': [1 if thallium == '7' else 0],
    }

    # Set one-hot values for smoking_status
    smoking_status = raw_json.get('smokingStatus', '')
    if smoking_status == 'Unknown':
        data['smoking_status_Unknown'] = [1]
    elif smoking_status == 'formerly smoked':
        data['smoking_status_formerly smoked'] = [1]
    elif smoking_status == 'never smoked':
        data['smoking_status_never smoked'] = [1]
    elif smoking_status == 'smokes':
        data['smoking_status_smokes'] = [1]

    # Set one-hot values for work_type
    work_type = raw_json.get('workType', '')
    if work_type == 'Govt_job':
        data['work_type_Govt_job'] = [1]
    elif work_type == 'Private':
        data['work_type_Private'] = [1]
    elif work_type == 'Self-employed':
        data['work_type_Self-employed'] = [1]
    elif work_type == 'children':
        data['work_type_children'] = [1]

    # Column order must match training output exactly
    # pd.get_dummies keeps non-dummied cols in place, appends dummies at end
    # in the order of the columns= parameter:
    # ['smoking_status', 'work_type', 'Chest pain type', 'Slope of ST', 'EKG results', 'Thallium']
    cols = [
        'Age', 'Gender', 'BP', 'Cholesterol', 'FBS over 120',
        'Max HR', 'Exercise angina', 'ST depression', 'Number of vessels fluro',
        'smoking_status_Unknown', 'smoking_status_formerly smoked',
        'smoking_status_never smoked', 'smoking_status_smokes',
        'work_type_Govt_job', 'work_type_Private', 'work_type_Self-employed', 'work_type_children',
        'Chest pain type_1', 'Chest pain type_2', 'Chest pain type_3', 'Chest pain type_4',
        'Slope of ST_1', 'Slope of ST_2', 'Slope of ST_3',
        'EKG results_0', 'EKG results_1', 'EKG results_2',
        'Thallium_3', 'Thallium_6', 'Thallium_7',
    ]
    return pd.DataFrame(data, columns=cols)
