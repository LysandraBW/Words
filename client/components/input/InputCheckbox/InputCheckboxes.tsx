import { Fragment } from "react/jsx-runtime";
import { Option } from "../InputDropdown";
import InputCheckbox from "./InputCheckbox";


interface InputCheckboxesProps<V> {
    value: V[];
    label: string;
    error: string;
    options: Option<V>[];
    onChange: (value: V) => void;
    inputClassName: string;
    labelClassName: string;
    inputWrapperClassName: string;
}


export default function InputCheckboxes<V>(props: Partial<InputCheckboxesProps<V>>) {
    const onChange = (value: V) => {
        if (!props.onChange)
            return;
        props.onChange(value);
    }
    
    return (
        <div className="">
            {props.label &&
                <p>
                    {props.label}
                </p>
            }
            <div className="flex flex-col gap-1">
                {props.options?.map((option, i) => (
                    <div 
                        key={i}
                        className={props.inputWrapperClassName}
                    >
                        <InputCheckbox
                            label={option.textLabel}
                            labelClassName={props.labelClassName}
                            checked={props.value?.includes(option.value)}
                            onChange={() => onChange(option.value)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}