import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import '../App.css';
import API_BASE_URL from '../config';
import PatientInputs from "../components/patient_inputs.tsx";
import ClinicalInputs from "../components/clinical_inputs.tsx";
import { RunButton } from '../lib/buttons.tsx';

const validationSchema = Yup.object().shape({
    model: Yup.string().required(),
    age: Yup.number().required('Required').min(1).max(120),
    gender: Yup.string().required('Required'),
    workType: Yup.string().required('Required'),
    smokingStatus: Yup.string().required('Required'),
    bp: Yup.number().required('Required').positive(),
    cholesterol: Yup.number().required('Required').positive(),
    maxHr: Yup.number().required('Required').positive(),
    stDepression: Yup.number().required('Required').min(0),
    fbs: Yup.string().required('Required'),
    chestPainType: Yup.string().required('Required'),
    ekgResults: Yup.string().required('Required'),
    exerciseAngina: Yup.string().required('Required'),
    slopeOfSt: Yup.string().required('Required'),
    numVesselsFluro: Yup.string().required('Required'),
    thallium: Yup.string().required('Required')
});

export function PredictPage() {
    const [prediction, setPrediction] = useState<any>(null);

    const initialValues = {
        model: 'svm',
        age: '',
        gender: '',
        workType: '',
        smokingStatus: '',
        bp: '',
        cholesterol: '',
        maxHr: '',
        stDepression: '',
        fbs: '',
        chestPainType: '',
        ekgResults: '',
        exerciseAngina: '',
        slopeOfSt: '',
        numVesselsFluro: '',
        thallium: ''
    };

    const handleSubmit = async (values: any) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/predict`, values);
            console.log(response.data);
            setPrediction(response.data);
        } catch (error) {
            console.error("Error running prediction", error);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, setFieldValue }) => (
                <Form className="body">
                    <div className="model-strip">
                        <div className={`model-card ${values.model === 'svm' ? 'active' : ''}`} onClick={() => setFieldValue('model', 'svm')}>
                            <div className="model-card-name">SVM</div>
                            <div className="model-card-type">support vector</div>
                            <div className="model-card-acc">85.5%</div>
                            <div className="model-card-acc-lbl">ACCURACY</div>
                        </div>
                        <div className={`model-card ${values.model === 'tree' ? 'active' : ''}`} onClick={() => setFieldValue('model', 'tree')}>
                            <div className="model-card-name">Decision Tree</div>
                            <div className="model-card-type">tree-based</div>
                            <div className="model-card-acc">85.5%</div>
                            <div className="model-card-acc-lbl">ACCURACY</div>
                        </div>
                        <div className={`model-card ${values.model === 'logistic' ? 'active' : ''}`} onClick={() => setFieldValue('model', 'logistic')}>
                            <div className="model-card-name">Logistic Reg.</div>
                            <div className="model-card-type">linear</div>
                            <div className="model-card-acc">89.1%</div>
                            <div className="model-card-acc-lbl">ACCURACY</div>
                        </div>
                        <div className={`model-card ${values.model === 'gboost' ? 'active' : ''}`} onClick={() => setFieldValue('model', 'gboost')}>
                            <div className="model-card-name">Gradient Boosting.</div>
                            <div className="model-card-type">ensemble</div>
                            <div className="model-card-acc">87.3%</div>
                            <div className="model-card-acc-lbl">ACCURACY</div>
                        </div>
                        <div className={`model-card ${values.model === 'knn' ? 'active' : ''}`} onClick={() => setFieldValue('model', 'knn')}>
                            <div className="model-card-name">KNN.</div>
                            <div className="model-card-type">distance-based</div>
                            <div className="model-card-acc">87.3%</div>
                            <div className="model-card-acc-lbl">ACCURACY</div>
                        </div>
                        <div className={`model-card ${values.model === 'random_forest' ? 'active' : ''}`} onClick={() => setFieldValue('model', 'random_forest')}>
                            <div className="model-card-name">Random Forest</div>
                            <div className="model-card-type">tree-based</div>
                            <div className="model-card-acc">89.1%</div>
                            <div className="model-card-acc-lbl">ACCURACY</div>
                        </div>
                    </div>

                    <PatientInputs />
                    <ClinicalInputs />

                    <RunButton type="submit">RUN PREDICTION</RunButton>

                    {prediction && prediction.error ? (
                        <div className="result-card result-card--error">
                            <div className="result-card__icon">❌</div>
                            <div className="result-card__title">Something went wrong</div>
                            <div className="result-card__desc">{prediction.error}</div>
                        </div>
                    ) : prediction && (
                        <div className={`result-card ${prediction.prediction === 1 ? 'result-card--danger' : 'result-card--safe'}`}>
                            <div className="result-card__icon">
                                {prediction.prediction === 1 ? '🫀' : '💚'}
                            </div>
                            <div className="result-card__title">
                                {prediction.prediction === 1 ? 'Heart Disease Risk Detected' : 'No Heart Disease Detected'}
                            </div>
                            <div className="result-card__desc">
                                {prediction.prediction === 1
                                    ? 'The selected model indicates a potential risk of heart disease based on the provided clinical data.'
                                    : 'Based on the provided clinical data, the selected model finds no significant indicators of heart disease.'}
                            </div>
                            {prediction.probability != null && (
                                <div className="result-card__prob">
                                    <div className="result-card__prob-header">
                                        <span className="result-card__prob-label">MODEL CONFIDENCE</span>
                                        <span className="result-card__prob-val">{(prediction.probability * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="result-card__prob-track">
                                        <div
                                            className="result-card__prob-fill"
                                            style={{ width: `${prediction.probability * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="result-card__disclaimer">
                                ⚕️ For educational use only — not a substitute for professional medical advice.
                            </div>
                        </div>
                    )}
                </Form>
            )}
        </Formik>
    );
}
