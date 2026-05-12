import { useField } from 'formik';

interface NumberFieldProps {
    label: string;
    name: string;
    placeholder?: string;
    min?: number | string;
    max?: number | string;
    step?: number | string;
}

export function NumberField({ label, ...props }: NumberFieldProps) {
    const [field] = useField(props);
    return (
        <div className="field">
            <label>{label}</label>
            <input type="number" {...field} {...props} />
        </div>
    );
}

interface SelectFieldProps {
    label: string;
    name: string;
    options: { label: string; value: string }[];
}

export function SelectField({ label, options, ...props }: SelectFieldProps) {
    const [field] = useField(props);
    return (
        <div className="field">
            <label>{label}</label>
            <div className="select-wrap">
                <select {...field} {...props}>
                    <option value="">Select option</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

interface RadioGroupFieldProps {
    label: string;
    name: string;
    options: { label: string; value: string }[];
}

export function RadioGroupField({ label, options, name }: RadioGroupFieldProps) {
    const [field, , helpers] = useField(name);
    return (
        <div className="field">
            <label>{label}</label>
            <div className="radio-group">
                {options.map((opt) => (
                    <div
                        key={opt.value}
                        className={`radio-opt ${field.value === opt.value ? 'sel' : ''}`}
                        onClick={() => helpers.setValue(opt.value)}
                    >
                        {opt.label}
                    </div>
                ))}
            </div>
        </div>
    );
}
