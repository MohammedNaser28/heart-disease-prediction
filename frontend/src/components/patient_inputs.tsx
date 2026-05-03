import '../App.css'
import { NumberField, RadioGroupField, SelectField } from '../lib/fields';

function PatientInputs() {
    return (
        <section className="patient-inputs">
            <div className="form-section">
                <div className="form-section-header">
                    <div className="step-num">1</div>
                    <div className="form-section-title">Patient demographics</div>
                </div>
                <div className="form-section-body">
                    <div className="field-row">
                        <NumberField label="AGE" name="age" placeholder="e.g. 54" min="1" max="120" />
                        <RadioGroupField
                            label="GENDER"
                            name="gender"
                            options={[
                                { label: 'Male', value: 'Male' },
                                { label: 'Female', value: 'Female' }
                            ]}
                        />
                    </div>
                    <SelectField
                        label="WORK TYPE"
                        name="workType"
                        options={[
                            { label: 'Private', value: 'Private' },
                            { label: 'Self-employed', value: 'Self-employed' },
                            { label: 'Government job', value: 'Govt_job' },
                            { label: 'Children', value: 'children' },
                            { label: 'Never worked', value: 'Never_worked' }
                        ]}
                    />
                    <RadioGroupField
                        label="SMOKING STATUS"
                        name="smokingStatus"
                        options={[
                            { label: 'Never smoked', value: 'never smoked' },
                            { label: 'Formerly smoked', value: 'formerly smoked' },
                            { label: 'Smokes', value: 'smokes' },
                            { label: 'Unknown', value: 'Unknown' }
                        ]}
                    />
                </div>
            </div>
        </section>
    )
}
export default PatientInputs