import { BookType as BookType } from "@/services/db/books";
import clsx from "clsx";
import { CirclePlusIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/router";

interface BookProps {
    book?: BookType;
    onClick: () => void;
    isCreateButton?: boolean;
}

export default function Book(props: BookProps) {
    return (
        <div className="w-[96px] flex flex-col gap-y-2 items-center">
            <div 
                onClick={props.onClick}
                className={clsx(
                    "w-[96px] h-[128px]",
                    "flex flex-col justify-center items-center gap-y-2",
                    "bg-zinc-900",
                    "cursor-pointer"
                )}
            >
                {props.book && props.book.book_cover_image &&
                    <img
                        src={props.book.book_cover_image}
                        className="w-full h-full object-cover object-center"
                    />
                }
                {(!props.book && props.isCreateButton) &&
                    <CirclePlusIcon
                        size={24}
                        className="text-white"
                    />
                }
            </div>
            <div className="w-full h-[60px] flex flex-col items-center gap-y-2">
                {props.book &&
                    <>
                        <span className="block text-xs text-center tracking-wide font-medium">
                            {props.book.book_name}
                        </span>
                    </>
                }
                {!props.book &&
                    <>
                        <div className="w-[calc(100%)] h-[14px] bg-zinc-900"/>
                    </>
                }
            </div>
        </div>
    )
}