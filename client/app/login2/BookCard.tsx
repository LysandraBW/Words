import { motion, AnimatePresence } from "framer-motion";
import { books } from "./books";
import clsx from "clsx";

interface BookCardProps {
    book: typeof books[number] | null;
}


export default function BookCard(props: BookCardProps) {
    return (
        <AnimatePresence>
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
                        "bg-neutral-300 bg-cover bg-center rounded-2xl",
                        props.book && props.book.background
                    )}
                >
                    {/* {props.book &&
                        <img 
                            src={props.book.background.slice(9, -3)}
                            className="w-full h-auto max-h-full rounded-2xl bg-cover bg-center"
                        />
                    } */}
                </div>
                <div
                    className="w-full min-w-0 h-full flex flex-col"
                >
                    {!props.book &&
                        <>
                            <div
                                className="w-full h-3 mb-4 bg-neutral-200 rounded-md"
                            />
                            <div
                                className="w-1/2 h-4 mb-2 bg-blue-500 rounded-md"
                            />
                            <div
                                className="w-8 h-3 mb-4 bg-blue-200 rounded-md"
                            />
                            <div
                                className="w-full grow bg-neutral-300 rounded-xl"
                            />
                        </>
                    }
                    {props.book &&
                        <>
                            <span className="block mb-1 text-xs tracking-wide">
                                <span className="block">
                                    {props.book.author}
                                </span>
                                <span className="block font-medium text-neutral-500">
                                    {props.book.title}
                                </span>
                            </span>
                            <div className="mb-3 flex flex-col gap-x-2">
                                <span className="block text-xl text-blue-500 font-bold">
                                    {props.book.word}
                                </span>
                                <span className="block relative top-[1.5px] w-fit px-2 py-0.5 bg-blue-200 rounded-md text-blue-500/50 text-xs tracking-wide font-medium">
                                    {props.book.speech}
                                </span>
                            </div>
                            <p className="text-sm overflow-hidden text-ellipsis line-clamp-4">
                                {props.book.definition}
                            </p>
                        </>
                    }
                </div>
                <div className={clsx(
                    "bg-neutral-200 w-1/4 h-full rounded-2xl",
                    props.book && 'invisible'
                )}/>
            </motion.div>
        </AnimatePresence>
    )
}