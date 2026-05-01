import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './App.css';
import Header from "./components/header.tsx";
import PatientInputs from "./components/patient_inputs.tsx";
import ClinicalInputs from "./components/clinical_inputs.tsx";

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
    fbs: Yup.string().required('Required')
});

function App() {
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
    fbs: ''
  };

  const handleSubmit = async (values: any) => {
    try {
        const response = await axios.post('http://localhost:8000/predict', values);
        setPrediction(response.data);
    } catch (error) {
        console.error("Error running prediction", error);
    }
  };

  return (
    <>
      <Header />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, handleChange }) => (
          <Form className="body">
            <div className="model-strip">
                <div className={`model-card ${values.model === 'svm' ? 'active' : ''}`} onClick={() => setFieldValue('model', 'svm')}>
                    <div className="model-card-name">SVM</div>
                    <div className="model-card-type">support vector</div>
                    <div className="model-card-acc">85%</div>
                    <div className="model-card-acc-lbl">ACCURACY</div>
                </div>
                <div className={`model-card ${values.model === 'dt' ? 'active' : ''}`} onClick={() => setFieldValue('model', 'dt')}>
                    <div className="model-card-name">Decision Tree</div>
                    <div className="model-card-type">tree-based</div>
                    <div className="model-card-acc">80%</div>
                    <div className="model-card-acc-lbl">ACCURACY</div>
                </div>
                <div className={`model-card ${values.model === 'lr' ? 'active' : ''}`} onClick={() => setFieldValue('model', 'lr')}>
                    <div className="model-card-name">Logistic Reg.</div>
                    <div className="model-card-type">linear</div>
                    <div className="model-card-acc">82%</div>
                    <div className="model-card-acc-lbl">ACCURACY</div>
                </div>
            </div>

            <PatientInputs values={values} setFieldValue={setFieldValue} handleChange={handleChange} />
            <ClinicalInputs values={values} setFieldValue={setFieldValue} handleChange={handleChange} />
            
            <button type="submit" className="run-btn">RUN PREDICTION</button>

            {prediction && (
                <div style={{ marginTop: '20px', padding: '20px', background: 'var(--card-bg)', borderRadius: '12px' }}>
                   <h3 style={{ color: 'var(--text-main)' }}>Prediction Results</h3>
                   <pre style={{ color: 'var(--text-sub)' }}>{JSON.stringify(prediction, null, 2)}</pre>
                </div>
            )}
          </Form>
        )}
      </Formik>
    </>
  )
}

export default App;
