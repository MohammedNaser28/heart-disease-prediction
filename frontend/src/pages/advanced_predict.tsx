import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import '../App.css';
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

interface RiskFactor {
    factor: string;
    value: string;
    advice: string;
}

interface AdvancedPrediction {
    prediction: number;
    probability: number | null;
    risk_level: string;
    risk_factors: RiskFactor[];
    error?: string;
}

export function AdvancedPredictPage() {
    const [prediction, setPrediction] = useState<AdvancedPrediction | null>(null);

    const initialValues = {
        model: 'logistic',
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
            const response = await axios.post('http://localhost:8000/advanced-predict', values);
            console.log(response.data);
            setPrediction(response.data);
        } catch (error) {
            console.error("Error running advanced prediction", error);
        }
    };

    const getGaugeClass = (prob: number) => {
        if (prob < 0.3) return 'safe';
        if (prob < 0.5) return 'borderline';
        return 'danger';
    };

    const getPanelClass = (result: AdvancedPrediction) => {
        if (result.error) return 'high-risk';
        if (result.prediction === 1) return 'high-risk';
        if (result.risk_level === 'borderline') return 'borderline';
        return 'low-risk';
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

                    <RunButton type="submit">RUN ADVANCED PREDICTION</RunButton>

                    {/* Error State */}
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

                    /* Disease Detected */
                    ) : prediction && prediction.prediction === 1 ? (
                        <div className={`result-panel ${getPanelClass(prediction)}`}>
                            <div className="result-header">
                                <div className="result-icon">🫀</div>
                                <div className="result-title">HEART DISEASE DETECTED</div>
                            </div>
                            <div className="result-body">
                                {prediction.probability !== null && prediction.probability !== undefined && (
                                    <div className="prob-container">
                                        <div className="prob-label">
                                            <span>Confidence</span>
                                            <span>{(prediction.probability * 100).toFixed(1)}%</span>
                                        </div>
                                        <div className="prob-bar-bg">
                                            <div
                                                className="prob-bar-fill"
                                                style={{ width: `${prediction.probability * 100}%`, background: 'var(--red)' }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Advice Cards */}
                                {prediction.risk_factors && prediction.risk_factors.length > 0 && (
                                    <div className="advice-section">
                                        <div className="advice-section-title">
                                            <span>📋</span> RECOMMENDATIONS
                                        </div>
                                        {prediction.risk_factors.map((rf, i) => (
                                            <div className="advice-card" key={i}>
                                                <div className="advice-card-header">
                                                    <div className="advice-card-factor">{rf.factor}</div>
                                                    <div className="advice-card-value">{rf.value}</div>
                                                </div>
                                                <div className="advice-card-text">{rf.advice}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="disclaimer">
                                    <span className="disclaimer-icon">⚕️</span>
                                    <span>This is not a substitute for professional medical advice. Please consult a qualified healthcare provider for diagnosis and treatment.</span>
                                </div>
                            </div>
                        </div>

                    /* No Disease — but maybe near */
                    ) : prediction && (
                        <div className={`result-panel ${getPanelClass(prediction)}`}>
                            <div className="result-header">
                                <div className="result-icon">
                                    {prediction.risk_level === 'borderline' ? '⚡' : '✅'}
                                </div>
                                <div className="result-title">
                                    {prediction.risk_level === 'borderline'
                                        ? 'YOU ARE NEAR TO HEART DISEASE'
                                        : 'NO HEART DISEASE DETECTED'}
                                </div>
                            </div>
                            <div className="result-body">
                                {prediction.probability !== null && prediction.probability !== undefined ? (
                                    <div className="risk-gauge-container">
                                        <div className="risk-gauge-header">
                                            <div className="risk-gauge-title">DISEASE PROXIMITY</div>
                                            <div className={`risk-gauge-value ${getGaugeClass(prediction.probability)}`}>
                                                {(prediction.probability * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                        <div className="risk-gauge-track">
                                            <div
                                                className={`risk-gauge-fill ${getGaugeClass(prediction.probability)}`}
                                                style={{ width: `${prediction.probability * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="risk-gauge-zones">
                                            <span className="risk-gauge-zone">0% SAFE</span>
                                            <span className="risk-gauge-zone">30%</span>
                                            <span className="risk-gauge-zone">50% DANGER</span>
                                        </div>

                                        {prediction.risk_level === 'borderline' ? (
                                            <div className="risk-message borderline">
                                                ⚡ You are close to developing heart disease. Consider lifestyle changes — regular exercise, balanced diet, and routine cardiac checkups can help prevent progression.
                                            </div>
                                        ) : (
                                            <div className="risk-message safe">
                                                ✅ You do not have heart disease. Keep maintaining a healthy lifestyle with regular physical activity and balanced nutrition.
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="prob-null">
                                        <em>Model provides binary classification without probability scores.</em>
                                    </div>
                                )}

                                {/* Show advice even if no disease but risk factors exist */}
                                {prediction.risk_factors && prediction.risk_factors.length > 0 && (
                                    <div className="advice-section">
                                        <div className="advice-section-title">
                                            <span>💡</span> AREAS TO WATCH
                                        </div>
                                        {prediction.risk_factors.map((rf, i) => (
                                            <div className="advice-card" key={i}>
                                                <div className="advice-card-header">
                                                    <div className="advice-card-factor">{rf.factor}</div>
                                                    <div className="advice-card-value">{rf.value}</div>
                                                </div>
                                                <div className="advice-card-text">{rf.advice}</div>
                                            </div>
                                        ))}
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
