import { BookType as BookType } from "@/services/db/book";
import clsx from "clsx";
import { CirclePlusIcon } from "lucide-react";

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
        </div>
    )
}