import { ReactNode } from "react";
import CloseButton from "./CloseButton";

interface ModalProps {
    onClose: () => void;
    title?: string;
    description?: string;
    children?: ReactNode;
}

export default function Modal(props: ModalProps) {
    return (
        <div className="w-[480px] min-w-[480px] max-w-[480px] overflow-y-scroll bg-black border border-zinc-800">
            <div className="w-full h-min pt-4 px-4 flex justify-end">
                <CloseButton
                    onClose={props.onClose}
                />
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