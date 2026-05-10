import { ChangeEvent, FocusEventHandler, ReactNode } from "react";
import InputLabel, { InputLabelProps } from "./InputLabel";
import InputError from "./InputError";
import InputWrapper from "./InputWrapper";
import clsx from "clsx";


export interface InputTextProps {
    type: string;
    value: string;
    label: string;
    placeholder: string;
    error: string;
    onBlur: FocusEventHandler<HTMLInputElement>;
    onChange: (value: string) => void;
    elementLeft: ReactNode;
    elementRight: ReactNode;
    inputClassName: string;
    inputBoxClassName: string;
    inputWrapperClassName: string;
}


export default function InputText(props: Partial<InputTextProps> & Partial<InputLabelProps>) {
    const onChange = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        if (!props.onChange)
            return;
        props.onChange(event.target.value);
    }

    
    return (
        <InputWrapper
            className={props.inputWrapperClassName}
        >
            <InputLabel
                label={props.label}
                required={props.required}
            />
            <div 
                className={clsx(
                    "input-box", 
                    // "has-[:focus]:border-blue-500/[0.75] has-[:focus]:ring-2 has-[:focus]:ring-blue-500/[0.125]",
                    props.inputBoxClassName
                )}
            >
                {props.elementLeft && props.elementLeft}
                <input
                    type={props.type}
                    value={props.value}
                    onChange={onChange}
                    onBlur={props.onBlur}
                    placeholder={props.placeholder}
                    className={clsx(
                        "input input-placeholder",
                        props.inputClassName
                    )}
                />
                {props.elementRight && props.elementRight}
            </div>
            <InputError
                error={props.error}
            />
        </InputWrapper>
    )
}