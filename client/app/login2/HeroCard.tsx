import clsx from "clsx";
import { scribble } from "../fonts";

export default function HeroCard() {
    return (
        <div className="absolute top-0 left-0 w-full h-full p-2 grid grid-cols-[auto_1fr_auto] grid-rows-1 gap-x-4 overflow-clip">
            <div className="flex flex-col gap-y-4">
                <div className="relative w-[80px] aspect-square flex flex-col bg-purple-200 -rotate-5">
                    <div className="relative top-0 left-0 w-full h-6 bg-purple-300">

                    </div>
                    <div className="p-1 flex flex-col grow justify-center items-center">
                        <span 
                            className={clsx(
                                scribble.className,
                                "text-black text-purple-500 text-center leading-4"
                            )}
                        >
                            {'<- books'}
                        </span>
                    </div>
                </div>
                <div className="relative w-[80px] aspect-square flex flex-col bg-green-200 -rotate-0">
                    <div className="relative top-0 left-0 w-full h-6 bg-green-300">

                    </div>
                    <div className="p-1 flex flex-col grow justify-center items-center">
                        <span 
                            className={clsx(
                                scribble.className,
                                "text-green-600 text-base text-center leading-4"
                            )}
                        >
                            imprudent vs impudent
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center gap-y-1">
                <span className="text-3xl text-white text-center font-semibold tracking-tight">
                    Read, Read, Read
                </span>
                <p className="max-w-xs text-lg text-center">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
            </div>
            <div className="flex flex-col justify-between items-end gap-y-4">
                <div className="relative w-[80px] aspect-square flex flex-col bg-yellow-200 rotate-7">
                    <div className="relative top-0 left-0 w-full h-6 bg-yellow-300">
                        
                    </div>
                    <div className="p-1 flex flex-col grow justify-center items-center">
                        <span 
                            className={clsx(
                                scribble.className,
                                "text-yellow-500 text-lg text-center leading-4"
                            )}
                        >
                            what is bedizened
                        </span>
                    </div>
                </div>
                <div className="relative w-[80px] aspect-square flex flex-col bg-sky-200">
                    <div className="relative top-0 left-0 w-full h-6 bg-sky-300">

                    </div>
                    <div className="p-1 flex flex-col grow justify-center items-center">
                        <span 
                            className={clsx(
                                scribble.className,
                                "text-blue-500 text-lg text-center leading-4"
                            )}
                        >
                            :-)
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}