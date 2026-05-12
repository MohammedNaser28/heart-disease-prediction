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
                        <div className="result-panel high-risk">
                            <div className="result-header">
                                <div className="result-icon">❌</div>
                                <div className="result-title">ERROR DETECTED</div>
                            </div>
                            <div className="result-body" style={{ padding: '0 20px 20px', color: '#ffaaaa' }}>
                                {prediction.error}
                            </div>
                        </div>
                    ) : prediction && (
                        <div className={`result-panel ${prediction.prediction === 1 ? 'high-risk' : 'low-risk'}`}>
                            <div className="result-header">
                                <div className="result-icon">
                                    {prediction.prediction === 1 ? '⚠️' : '✅'}
                                </div>
                                <div className="result-title">
                                    {prediction.prediction === 1 ? 'HIGH RISK DETECTED' : 'LOW RISK'}
                                </div>
                            </div>
                            <div className="result-body">
                                {prediction.probability !== null && prediction.probability !== undefined ? (
                                    <div className="prob-container">
                                        <div className="prob-label">
                                            <span>Confidence Score</span>
                                            <span>{(prediction.probability * 100).toFixed(1)}%</span>
                                        </div>
                                        <div className="prob-bar-bg">
                                            <div
                                                className="prob-bar-fill"
                                                style={{ width: `${prediction.probability * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="prob-null">
                                        <em>Model provides binary classification without probability scores.</em>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Form>
            )}
        </Formik>
    );
}
