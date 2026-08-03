import { ReactNode } from "react";
import CloseButton from "./CloseButton";
import { XIcon } from "lucide-react";
import { Rnd } from "react-rnd";

interface ModalProps {
    onClose: () => void;
    title?: string;
    description?: string;
    children?: ReactNode;
}

export default function Modal(props: ModalProps) {
    return (
        <Rnd
            key={props.title}
            default={{
                x: window.innerWidth / 2 - 300,
                y: window.innerHeight / 2 - 200,
                width: 600,
                height: 400
            }}
            maxWidth={window.innerWidth - 100}
            maxHeight={window.innerHeight - 100}
            style={{
                zIndex: 200
            }}
            
        >
            <div className="w-[480px] min-w-[480px] max-w-[480px] overflow-y-scroll bg-neutral-950/80 backdrop-blur-xl border border-neutral-800 rounded-xl">
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
                        <h3 className="text-xl text-white font-medium tracking-tight">
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
        </Rnd>
    )
}