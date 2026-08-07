import { ChangeEvent, ChangeEventHandler, FocusEventHandler, ReactNode } from "react";
import InputLabel, { InputLabelProps } from "./InputLabel";
import InputError from "./InputError";
import InputWrapper from "./InputWrapper";
import clsx from "clsx";


export interface InputTextAreaProps {
    type: string;
    value: string;
    label: string;
    placeholder: string;
    error: string;
    onBlur: FocusEventHandler<HTMLTextAreaElement>;
    onChange: (value: string) => void;
    elementLeft: ReactNode;
    elementRight: ReactNode;
    inputClassName: string;
    inputBoxClassName: string;
    inputWrapperClassName: string;
}


export default function InputTextArea(props: Partial<InputTextAreaProps> & Partial<InputLabelProps>) {
    const onChange = (event: ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>) => {
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
                    
                )}
            >
                {props.elementLeft && props.elementLeft}
                <textarea
                    value={props.value}
                    onChange={onChange}
                    onBlur={props.onBlur}
                    placeholder={props.placeholder}
                    className={clsx(
                        "input input-placeholder",
                        "input-box !py-3 !min-h-[96px] !max-h-none",
                        props.inputBoxClassName,
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