import { ImageIcon, XIcon } from "lucide-react";
import InputText, { InputTextProps } from "./InputText";
import clsx from "clsx";

export default function InputImageURL(props: Partial<InputTextProps>) {
    return (
        <div className="grid grid-cols-[1fr_36px] gap-x-4 items-end">
            <InputText
                label={props.label}
                value={props.value}
                placeholder={props.placeholder}
                onChange={props.onChange}
            />
            <div className="relative w-[36px] h-[36px] flex justify-center items-center rounded-md bg-zinc-900">
                <ImageIcon
                    size={16}
                    className="text-zinc-500"
                />
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
                            "bg-zinc-800 rounded-full group",
                            "cursor-pointer"
                        )}
                    >
                        <XIcon
                            size={8}
                            strokeWidth={3}
                            className="text-zinc-500 group-hover:text-red-500 cursor-pointer"
                        />
                    </button>
                }
            </div>
        </div>
    )
}