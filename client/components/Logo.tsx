import clsx from "clsx";
import { gamjaFlower } from "@/app/fonts";

interface LogoProps {
    spanClassName?: string;
}

export default function Logo(props: LogoProps) {
    return (
        <span
            className={clsx(
                gamjaFlower.className,
                "block h-min w-min",
                "text-[32px] leading-[32px] select-none",
                props.spanClassName
            )}
        >
            <span className='text-blue-500'>
                W
            </span>
            <span className='text-blue-500'>
                o
            </span>
            <span className='text-blue-500'>
                r
            </span>
            <span className='text-blue-500'>
                d
            </span>
            <span className='text-blue-500'>
                s
            </span>
        </span>
    )
}