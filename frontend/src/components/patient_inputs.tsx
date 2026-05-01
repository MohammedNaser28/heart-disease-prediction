import '../App.css'

interface PatientInputsProps {
    values: any;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    handleChange: (e: React.ChangeEvent<any>) => void;
}

function PatientInputs({ values, setFieldValue, handleChange }: PatientInputsProps) {
    return (
        <section className="patient-inputs">
            <div className="form-section">
                <div className="form-section-header">
                    <div className="step-num">1</div>
                    <div className="form-section-title">Patient demographics</div>
                </div>
                <div className="form-section-body">
                    <div className="field-row">
                        <div className="field">
                            <label>AGE</label>
                            <input type="number" name="age" placeholder="e.g. 54" min="1" max="120" value={values.age} onChange={handleChange} />
                        </div>
                        <div className="field">
                            <label>GENDER</label>
                            <div className="radio-group">
                                <div className={`radio-opt ${values.gender === 'Male' ? 'sel' : ''}`} onClick={() => setFieldValue('gender', 'Male')}>Male</div>
                                <div className={`radio-opt ${values.gender === 'Female' ? 'sel' : ''}`} onClick={() => setFieldValue('gender', 'Female')}>Female</div>
                            </div>
                        </div>
                    </div>
                    <div className="field">
                        <label>WORK TYPE</label>
                        <div className="select-wrap">
                            <select name="workType" value={values.workType} onChange={handleChange}>
                                <option value="">Select work type</option>
                                <option value="Private">Private</option>
                                <option value="Self-employed">Self-employed</option>
                                <option value="Govt_job">Government job</option>
                                <option value="children">Children</option>
                                <option value="Never_worked">Never worked</option>
                            </select>
                        </div>
                    </div>
                    <div className="field">
                        <label>SMOKING STATUS</label>
                        <div className="radio-group">
                            <div className={`radio-opt ${values.smokingStatus === 'never smoked' ? 'sel' : ''}`} onClick={() => setFieldValue('smokingStatus', 'never smoked')}>Never smoked</div>
                            <div className={`radio-opt ${values.smokingStatus === 'formerly smoked' ? 'sel' : ''}`} onClick={() => setFieldValue('smokingStatus', 'formerly smoked')}>Formerly smoked</div>
                            <div className={`radio-opt ${values.smokingStatus === 'smokes' ? 'sel' : ''}`} onClick={() => setFieldValue('smokingStatus', 'smokes')}>Smokes</div>
                            <div className={`radio-opt ${values.smokingStatus === 'Unknown' ? 'sel' : ''}`} onClick={() => setFieldValue('smokingStatus', 'Unknown')}>Unknown</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default PatientInputs