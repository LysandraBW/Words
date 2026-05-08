import { Fragment, useState } from "react";
import InputLabel from "../InputLabel";
import InputError from "../InputError";
import InputWrapper from "../InputWrapper";
import clsx from "clsx";
import InputTag from "./InputTag";
import { CornerDownLeftIcon } from "lucide-react";

interface InputTagsProps {
    value: string[];
    label: string;
    error: string;
    placeholder: string;
    onInsert: (value: string) => void;
    onDelete: (value: string) => void;
    inputClassName: string;
    buttonClassName: string;
}

export default function InputTags(props: Partial<InputTagsProps>) {
    const [value, setValue] = useState("");

    const onEnter = (event: any) => {
        if (event.code !== "Enter" || !value || !props.onInsert)
            return;
        props.onInsert(value);
        setValue("");
    }

    const onClick = (event: any) => {
        if (!value || !props.onInsert)
            return;
        props.onInsert(value);
        setValue("");
    }

    return (
        <InputWrapper>
            <InputLabel
                label={props.label}
            />
            <div className="min-h-[36px] max-h-[36px] h-[36px] flex">
                <input
                    value={value}
                    onKeyUp={onEnter}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={props.placeholder}
                    className={clsx(
                        "w-full min-h-[36px] max-h-[36px] h-[36px] px-4 py-1",
                        "bg-neutral-900 rounded-l-md outline-none peer hover:bg-neutral-800 focus:bg-neutral-800 border border-neutral-800",
                        "text-sm text-neutral-500 tracking-normal focus:text-white",
                        props.inputClassName
                    )}
                />
                <button
                    onClick={onClick}
                    className={clsx(
                        "px-4 py-1 bg-neutral-900 rounded-r-md cursor-pointer group border border-neutral-700 border-l-0",
                        props.buttonClassName
                    )}
                >
                    <CornerDownLeftIcon
                        size={16}
                        className="text-neutral-500 group-hover:text-blue-500"
                    />
                </button>
            </div>
            {!!props.value?.length &&
                <div className="flex gap-1">
                    {props.value?.map((value, i) => (
                        <Fragment key={i}>
                            <InputTag
                                tag={value}
                                onDelete={() => {
                                    if (props.onDelete)
                                        props.onDelete(value);
                                }}
                            />
                        </Fragment>
                    ))}
                </div>
            }
            {!!props.error?.length &&
                <InputError
                    error={props.error}
                />
            }
        </InputWrapper>
    )
}