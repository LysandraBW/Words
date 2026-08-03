import { ReactNode } from "react";
import CloseButton from "./CloseButton";
import { XIcon } from "lucide-react";

interface PanelProps {
    onClose: () => void;
    title?: string;
    description?: string;
    children?: ReactNode;
}

export default function Panel(props: PanelProps) {
    return (
        <div 
            className="absolute z-[300] w-[480px] min-w-[480px] max-w-[480px] min-h-screen h-screen max-h-screen absolute top-0 right-0 overflow-y-auto bg-neutral-950/80 backdrop-blur-xl border-l border-l-neutral-900"
            style={{
                boxShadow: '#00000008 0px 0px 10px 10px'
            }}    
        >
            <div className="w-full h-min pt-2 px-2 flex justify-end">
                <button 
                    className="w-6 aspect-square flex justify-center items-center group bg-neutral-900 rounded-full"
                    onClick={props.onClose}
                >
                    <XIcon
                        size={12}
                        strokeWidth={2}
                        className="scale-x-85 cursor-pointer text-neutral-400 group-hover:text-white"
                    />
                </button>
            </div>
            <div className="px-8 pb-4 border-b border-b-neutral-900">
                <header>
                    <h3 className="text-xl text-neutral-300 font-medium tracking-tight">
                        {props.title}
                    </h3>
                    {props.description &&
                        <p className="text-neutral-500 tracking-wide">
                            {props.description}
                        </p>
                    }
                </header>
            </div>
            {props.children}
        </div>
    )
}