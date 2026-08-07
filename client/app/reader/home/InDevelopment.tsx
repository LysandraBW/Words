import clsx from "clsx";
import { HandIcon, TrendingUpIcon } from "lucide-react";

export default function InDevelopmentBanner() {
    return (
        <div
            className="w-full p-4 flex flex-col gap-y-4 justify-between bg-neutral-900 border border-neutral-800 rounded-lg shadow-md"
        >
            <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-500">
                    Hello, I'm Lysandra
                </span>
                <HandIcon
                    size={16}
                    className="stroke-blue-500"
                />
            </div>
            <div>
                <div className="mb-1 flex gap-x-2 items-center">
                    <span className="text-2xl text-neutral-100 font-medium">
                        In Development
                    </span>
                    <span 
                        className={clsx(
                            "px-2 py-0.5 flex gap-x-1.5 items-center rounded-full",
                            "bg-blue-500/10",
                        )}
                    >
                        <TrendingUpIcon
                            size={10}
                            className="stroke-blue-500"
                        />
                        <span className={clsx("text-xs text-blue-500")}>
                            65%
                        </span>
                    </span>
                </div>
                <span className="block max-w-lg text-sm text-neutral-500">
                    This website is still under development. As I am the only person working on this project, it takes me some time. Nevertheless, if you would like to suggest a feature or provide criticism feel free to contact me at <span className="text-neutral-500">lysandrab.w910@gmail.com</span>.
                </span>
            </div>
        </div>
    )
}