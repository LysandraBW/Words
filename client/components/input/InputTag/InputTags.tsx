import { Fragment, useState } from "react";
import InputLabel from "../InputLabel";
import InputLabelError from "../InputLabelError";
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
                        "bg-zinc-900 rounded-l-md outline-none peer hover:bg-zinc-800 focus:bg-zinc-800 border border-zinc-800",
                        "text-sm text-zinc-400 tracking-normal focus:text-white",
                        props.inputClassName
                    )}
                />
                <button
                    onClick={onClick}
                    className="px-4 py-1 bg-zinc-900 rounded-r-md cursor-pointer group border border-zinc-800 border-l-0"
                >
                    <CornerDownLeftIcon
                        size={16}
                        className="text-zinc-500 group-hover:text-blue-500"
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
                <InputLabelError
                    label={props.error}
                />
            }
        </InputWrapper>
    )
}