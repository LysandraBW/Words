import { BookType as BookType } from "@/services/db/book";
import { CirclePlusIcon } from "lucide-react";

interface BookProps {
    book: BookType;
    onClick: () => void;
    isCreate: boolean;
}

export default function Book(props: Partial<BookProps>) {
    return (
        <button 
            onClick={props.onClick}
            className="w-[96px] h-[128px] flex flex-col gap-y-2 justify-center items-center bg-zinc-900"
        >
            {/* Create Book Button */}
            {(!props.book && props.isCreate) &&
                <CirclePlusIcon
                    size={24}
                    className="text-white"
                />
            }
            {/* Book Button */}
            {(props.book && props.book.book_cover_image) &&
                <img
                    src={props.book.book_cover_image}
                    className="w-full h-full object-cover object-center"
                />
            }
        </button>
    )
}