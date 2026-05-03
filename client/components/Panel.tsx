import { ReactNode } from "react";
import CloseButton from "./CloseButton";

interface PanelProps {
    onClose: () => void;
    title?: string;
    description?: string;
    children?: ReactNode;
}

export default function Panel(props: PanelProps) {
    return (
        <div className="w-[480px] min-w-[480px] max-w-[480px] min-h-screen h-screen max-h-screen absolute top-0 right-0 overflow-y-auto bg-zinc-800 border-l border-l-zinc-700">
            <div className="w-full h-min pt-4 px-4 flex justify-end">
                <CloseButton
                    onClose={props.onClose}
                />
            </div>
            <div className="px-8">
                <header>
                    <h3 className="text-xl text-zinc-200 font-medium tracking-tight">
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