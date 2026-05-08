import { AsteriskIcon } from "lucide-react";

export interface InputLabelProps {
    label: string;
    required: boolean;
}

export default function InputLabel(props: Partial<InputLabelProps>) {
    return (
        <>
            {props.label &&
                <div className="flex items-start">
                    <span className="text-sm tracking-wide">
                        {props.label}
                    </span>
                    {props.required &&
                        <AsteriskIcon
                            size={10}
                            className="text-red-500"
                        />
                    }
                </div>
            }
        </>
    )
}