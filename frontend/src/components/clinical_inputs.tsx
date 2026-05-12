import "../App.css"
import { NumberField, RadioGroupField, SelectField } from '../lib/fields';

function ClinicalInputs() {
    return (
        <div className="form-section">
            <div className="form-section-header">
                <div className="step-num">2</div>
                <div className="form-section-title">Clinical measurements</div>
            </div>
            <div className="form-section-body">
                <div className="field-row three">
                    <NumberField label="BLOOD PRESSURE" name="bp" placeholder="mmHg" />
                    <NumberField label="CHOLESTEROL" name="cholesterol" placeholder="mg/dL" />
                    <NumberField label="MAX HEART RATE" name="maxHr" placeholder="bpm" />
                </div>
                <div className="field-row">
                    <NumberField label="ST DEPRESSION" name="stDepression" placeholder="0.0" step="0.1" />
                    <RadioGroupField
                        label="FASTING BLOOD SUGAR"
                        name="fbs"
                        options={[
                            { label: 'Normal', value: 'Normal' },
                            { label: '>120 mg/dL', value: '>120 mg/dL' }
                        ]}
                    />
                </div>
                <div className="field-row">
                    <SelectField
                        label="CHEST PAIN TYPE"
                        name="chestPainType"
                        options={[
                            { label: 'Type 1', value: '1' },
                            { label: 'Type 2', value: '2' },
                            { label: 'Type 3', value: '3' },
                            { label: 'Type 4', value: '4' }
                        ]}
                    />
                    <SelectField
                        label="EKG RESULTS"
                        name="ekgResults"
                        options={[
                            { label: 'Normal (0)', value: '0' },
                            { label: 'Abnormality (1)', value: '1' },
                            { label: 'Hypertrophy (2)', value: '2' }
                        ]}
                    />
                </div>
                <div className="field-row">
                    <RadioGroupField
                        label="EXERCISE ANGINA"
                        name="exerciseAngina"
                        options={[
                            { label: 'No', value: '0' },
                            { label: 'Yes', value: '1' }
                        ]}
                    />
                    <SelectField
                        label="SLOPE OF ST"
                        name="slopeOfSt"
                        options={[
                            { label: 'Upsloping (1)', value: '1' },
                            { label: 'Flat (2)', value: '2' },
                            { label: 'Downsloping (3)', value: '3' }
                        ]}
                    />
                </div>
                <div className="field-row">
                    <SelectField
                        label="VESSELS FLURO"
                        name="numVesselsFluro"
                        options={[
                            { label: '0', value: '0' },
                            { label: '1', value: '1' },
                            { label: '2', value: '2' },
                            { label: '3', value: '3' }
                        ]}
                    />
                    <SelectField
                        label="THALLIUM"
                        name="thallium"
                        options={[
                            { label: 'Normal (3)', value: '3' },
                            { label: 'Fixed Defect (6)', value: '6' },
                            { label: 'Reversable Defect (7)', value: '7' }
                        ]}
                    />
                </div>
            </div>
        </div>
    )
}

export default ClinicalInputs;