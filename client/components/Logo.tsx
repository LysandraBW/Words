import clsx from "clsx";

interface LogoProps {
    logoClassName?: string;
    anchorClassName?: string;
}

export default function Logo(props: LogoProps) {
    return (
        <a 
            href="/"
            className={clsx(
                "w-fit h-fit flex items-center gap-1",
                props.anchorClassName
            )}
        >
            <div 
                className={clsx(
                    "h-[19px] aspect-square p-[2px] grid grid-cols-[1fr_2fr] grid-rows-3 gap-[2px] rounded-sm bg-blue-600 border border-blue-500",
                    props.logoClassName
                )}
            >
                <div className="h-full !aspect-square col-start-1 col-span-1 row-start-1 row-span-1 bg-blue-400 rounded-[1px]">
                </div>
                <div className="h-full col-start-2 col-span-1 row-start-1 row-span-1 bg-blue-800 rounded-[2px]">
                </div>
                <div className="h-full col-start-1 col-span-2 row-start-2 row-span-1 bg-blue-800 rounded-[2px]">
                </div>
                <div className="h-full col-start-1 col-span-2 row-start-3 row-span-1 bg-blue-800 rounded-[2px]">
                </div>
            </div>
        </a>
    )
}