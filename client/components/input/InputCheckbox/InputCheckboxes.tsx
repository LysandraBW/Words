import { Option } from "../InputDropdown";
import InputCheckbox from "./InputCheckbox";


interface InputCheckboxesProps<V> {
    value: V[];
    label: string;
    error: string;
    options: Option<V>[];
    onChange: (value: V) => void;
}


export default function InputCheckboxes<V>(props: Partial<InputCheckboxesProps<V>>) {
    const onChange = (value: V) => {
        if (!props.onChange)
            return;
        props.onChange(value);
    }
    
    return (
        <div>
            {props.label &&
                <p>
                    {props.label}
                </p>
            }
            {props.options?.map((option, i) => (
                <InputCheckbox
                    label={option.textLabel}
                    checked={props.value?.includes(option.value)}
                    onChange={() => onChange(option.value)}
                />
            ))}
        </div>
    );
}