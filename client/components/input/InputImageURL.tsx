import { ImageIcon, XIcon } from "lucide-react";
import InputText, { InputTextProps } from "./InputText";
import clsx from "clsx";


interface InputImageURLProps extends Partial<InputTextProps> {
    buttonClassName?: string;
    buttonSVGClassName?: string;
}


export default function InputImageURL(props: InputImageURLProps) {
    return (
        <div className="grid grid-cols-[1fr_36px] gap-x-1 items-end">
            <InputText
                label={props.label}
                value={props.value}
                placeholder={props.placeholder}
                onChange={props.onChange}
                inputClassName={props.inputClassName}
                inputWrapperClassName={props.inputWrapperClassName}
            />
            <div 
                className={clsx(
                    "relative w-[36px] h-[36px] flex justify-center items-center rounded-md bg-neutral-900 border border-neutral-800",
                    props.inputWrapperClassName
                )}
            >
                {!props.value &&
                    <ImageIcon
                        size={16}
                        className="text-neutral-500"
                    />
                }
                {props.value &&
                    <img
                        src={props.value}
                        className="w-full h-full object-cover object-center rounded-md"
                    />
                }
                {props.value &&
                    <button 
                        onClick={() => props.onChange && props.onChange("")}
                        className={clsx(
                            "absolute top-[-4px] right-[-4px] w-4 h-4",
                            "flex justify-center items-center",
                            "bg-neutral-800 rounded-full group",
                            "cursor-pointer",
                            props.buttonClassName
                        )}
                    >
                        <XIcon
                            size={8}
                            strokeWidth={3}
                            className={clsx(
                                "text-neutral-500 group-hover:text-red-500 cursor-pointer",
                                props.buttonSVGClassName
                            )}
                        />
                    </button>
                }
            </div>
        </div>
    )
}