import "../App.css"

interface ClinicalInputsProps {
    values: any;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    handleChange: (e: React.ChangeEvent<any>) => void;
}

function ClinicalInputs({ values, setFieldValue, handleChange }: ClinicalInputsProps) {
    return (
        <div className="form-section">
            <div className="form-section-header">
                <div className="step-num">2</div>
                <div className="form-section-title">Clinical measurements</div>
            </div>
            <div className="form-section-body">
                <div className="field-row three">
                    <div className="field">
                        <label>BLOOD PRESSURE</label>
                        <input type="number" name="bp" placeholder="mmHg" value={values.bp} onChange={handleChange} />
                    </div>
                    <div className="field">
                        <label>CHOLESTEROL</label>
                        <input type="number" name="cholesterol" placeholder="mg/dL" value={values.cholesterol} onChange={handleChange} />
                    </div>
                    <div className="field">
                        <label>MAX HEART RATE</label>
                        <input type="number" name="maxHr" placeholder="bpm" value={values.maxHr} onChange={handleChange} />
                    </div>
                </div>
                <div className="field-row">
                    <div className="field">
                        <label>ST DEPRESSION</label>
                        <input type="number" name="stDepression" placeholder="0.0" step="0.1" value={values.stDepression} onChange={handleChange} />
                    </div>
                    <div className="field">
                        <label>FASTING BLOOD SUGAR</label>
                        <div className="radio-group">
                            <div className={`radio-opt ${values.fbs === 'Normal' ? 'sel' : ''}`} onClick={() => setFieldValue('fbs', 'Normal')}>Normal</div>
                            <div className={`radio-opt ${values.fbs === '>120 mg/dL' ? 'sel' : ''}`} onClick={() => setFieldValue('fbs', '>120 mg/dL')}>&gt;120 mg/dL</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClinicalInputs;