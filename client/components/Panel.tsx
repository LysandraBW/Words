import clsx from "clsx";
import { XIcon } from "lucide-react";
import { ReactNode } from "react";

interface PanelProps {
    onClose: () => void;
    title?: string;
    description?: string;
    children?: ReactNode;
}

export default function Panel(props: PanelProps) {
    return (
        <div className="w-[480px] min-w-[480px] max-w-[480px] min-h-screen h-screen max-h-screen sticky top-0 overflow-y-auto bg-black border-l border-l-zinc-800">
            <div className="w-full h-min pt-4 px-4 flex justify-end">
                <button 
                    onClick={props.onClose}
                    className={clsx(
                        "w-4 h-4 aspect-square flex justify-center items-center",
                        "rounded-full bg-zinc-900 cursor-pointer"
                    )}
                >
                    <XIcon
                        size={8}
                        strokeWidth={3}
                        className="text-zinc-500"
                    />
                </button>
            </div>
            <div className="px-8">
                <header>
                    <h3 className="text-xl text-white font-medium tracking-tight">
                        {props.title}
                    </h3>
                    {props.description &&
                        <p className="text-zinc-400 tracking-wide">
                            {props.description}
                        </p>
                    }
                </header>
            </div>
            {props.children}
        </div>
    )
}