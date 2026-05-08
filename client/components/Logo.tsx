import clsx from "clsx";
import { scribble } from "@/app/fonts";
import { SmileIcon } from "lucide-react";

interface LogoProps {
    spanClassName?: string;
}

export default function Logo(props: LogoProps) {
    return (
        <a 
            href="/"
            className="w-fit flex items-center gap-1"
        >
            <div className="w-4 h-4">
                <SmileIcon
                    strokeWidth={2.5}
                    className="w-full h-full text-white"
                />
            </div>
            <span 
                className={clsx(
                    "block text-xl text-white",
                    scribble.className
                )}
            >
                Words
            </span>
        </a>
    )
}