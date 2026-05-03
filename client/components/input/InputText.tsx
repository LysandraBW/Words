import { ChangeEvent, FocusEventHandler, ReactNode } from "react";
import InputLabel, { InputLabelProps } from "./InputLabel";
import InputLabelError from "./InputLabelError";
import InputWrapper from "./InputWrapper";
import clsx from "clsx";

export interface InputTextProps {
    value: string;
    label: string;
    error: string;
    onBlur: FocusEventHandler<HTMLInputElement>;
    onChange: (value: string) => void;
    inputClassName: string;
    inputWrapperClassName: string;
    placeholder: string;
    type: string;
    wrapperClassName: string;
    leftElement: ReactNode;
}


export default function InputText(props: Partial<InputTextProps> & Partial<InputLabelProps>) {
    const onChange = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        if (!props.onChange)
            return;
        props.onChange(event.target.value);
    }

    return (
        <InputWrapper
            className={props.wrapperClassName}
        >
            <InputLabel
                label={props.label}
                required={props.required}
            />
            <div
                className={clsx(
                    "w-full min-h-[36px] max-h-[36px] h-[36px] px-4 py-1",
                    "flex gap-x-2 items-center",
                    "rounded-md outline-none",
                    "bg-zinc-900 hover:bg-zinc-800 has-[:focus]:bg-zinc-800 border border-zinc-800",
                    props.inputWrapperClassName
                )}
            >
                {props.leftElement && props.leftElement}
                <input
                    type={props.type}
                    value={props.value}
                    onChange={onChange}
                    onBlur={props.onBlur}
                    placeholder={props.placeholder}
                    className={clsx(
                        "w-full h-full",
                        "outline-none",
                        "text-sm text-zinc-400 tracking-wide focus:text-white placeholder:text-zinc-500 placeholder:tracking-wide",
                        props.inputClassName
                    )}
                />
            </div>
            {!!props.error?.length &&
                <InputLabelError
                    label={props.error}
                />
            }
        </InputWrapper>
    )
}