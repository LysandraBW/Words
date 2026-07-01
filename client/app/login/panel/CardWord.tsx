import { motion, AnimatePresence } from "framer-motion";
import { books } from "../books";
import clsx from "clsx";
import { Volume2Icon } from "lucide-react";


interface CardWordProps {
    book: typeof books[number] | null;
    pauseInterval: () => void;
    startInterval: () => void;
}


export default function CardWord(props: CardWordProps) {
    return (
        <AnimatePresence
            initial={false}
        >
            <motion.div
                key={props.book?.title || ''}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-full h-full p-2 flex gap-x-2 overflow-clip"
            >
                <div
                    className={clsx(
                        "h-full aspect-2/3",
                        "bg-neutral-800 bg-cover bg-center rounded-2xl",
                        props.book && props.book.background
                    )}
                    style={props.book ? {
                        background: `url(${props.book?.background})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                    } : {}}
                    onMouseEnter={props.pauseInterval}
                    onMouseLeave={props.startInterval}
                />
                <div
                    className="w-full min-w-0 h-full flex flex-col"
                >
                    {!props.book &&
                        <>
                            <div
                                className="w-full h-3 mb-4 bg-neutral-700 rounded-md"
                            />
                            <div
                                className="w-1/2 h-4 mb-2 bg-neutral-500 rounded-md"
                            />
                            <div
                                className="w-8 h-3 mb-4 bg-neutral-700 rounded-md"
                            />
                            <div
                                className="w-full grow bg-neutral-800 rounded-xl"
                            />
                        </>
                    }
                    {props.book &&
                        <>
                            <span className="block mb-1 text-xs tracking-wide">
                                <span className="block">
                                    {props.book.author}'s
                                </span>
                                <span className="block font-medium">
                                    {props.book.title}
                                </span>
                            </span>
                            <div className="mb-3 flex flex-col gap-x-2">
                                <span className="block text-xl text-neutral-500 font-bold text-pretty wrap-anywhere">
                                    {props.book.word}
                                </span>
                                <span className="block relative top-[1.5px] w-fit px-2 pb-0.5 bg-neutral-700 rounded-md text-neutral-500/75 text-xs tracking-wide font-medium">
                                    {props.book.speech}
                                </span>
                            </div>
                            <p className="text-base tracking-wide overflow-hidden text-ellipsis line-clamp-4">
                                {props.book.definition}
                            </p>
                        </>
                    }
                </div>
                <div 
                    className={clsx(
                        "w-1/4 h-full",
                        "p-2 bg-neutral-800 rounded-2xl",
                        props.book && "ml-2 hover:scale-97 transition-all"
                    )}
                >
                    {props.book && 
                        <>
                            <button 
                                onClick={() => {
                                    if (!props.book)
                                        return;
                                    const utterance = new SpeechSynthesisUtterance(props.book.word);
                                    window.speechSynthesis.speak(utterance);
                                }}
                                className="w-full h-full flex flex-col justify-center items-center gap-y-2"
                            >
                                <Volume2Icon
                                    size={20}
                                    className="text-neutral-500/75"
                                />
                                <label className="text-xs text-neutral-500/75 font-semibold tracking-wide">
                                    PLAY
                                </label>
                            </button>
                        </>
                    }
                </div>
            </motion.div>
        </AnimatePresence>
    )
}