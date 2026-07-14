import useFilterObjects from "@/hooks/useFilterObject";
import { BookType } from "@/services/server/book";
import { Option } from "@/components/input/InputDropdown";
import TableHead from "./home/TableHead";
import TableBody from "./home/TableBody";
import ActionBar from "./home/ActionBar/ActionBar";
import NavigationBar from "./home/Navigation";
import { PlusIcon } from "lucide-react";
import clsx from "clsx";
import { nunito } from "../fonts";

interface BookTabProps {
    books: BookType[];
    onCreate: () => void;
}

export default function BookTab(props: BookTabProps) {
    const filterBooks = useFilterObjects({ 
        objects: props.books,
        getObjectValueCallback: (k, o) => {
            if (k === "all")
                return o.book_name + " " + o.book_author;
            return "";
        }
    });

    
    const bookSearchOptions: Option<string>[] = [
        {
            value: "all",
            textLabel: "All"
        },
        {
            value: "book_name",
            textLabel: "Name"
        },
        {
            value: "book_author",
            textLabel: "Author"
        }
    ];


    const bookSortOptions: Option<keyof BookType>[] = [
        {
            value: "book_name",
            textLabel: "Name"
        },
        {
            value: "book_author",
            textLabel: "Author"
        },
        {
            value: "book_year",
            textLabel: "Year"
        }
    ];


    return (
        <>
            <ActionBar
                searchOptions={bookSearchOptions}
                sortOptions={bookSortOptions}
                filter={filterBooks}
                onCreate={props.onCreate}
            />
            <TableHead
                columns={["Name", "Author", "Year"]}
            />
            <TableBody
                objects={filterBooks.filteredObjects}
                objectID={"book_id"}
                keys={["BookName", "BookAuthor", "book_year"]}
                getElementCallback={(key, book) => {
                    if (key === "BookName") {
                        return (
                            <>
                                <div 
                                    className="w-4 h-4 bg-center bg-cover"
                                    style={{
                                        backgroundImage: `url(${book.book_cover_image})`
                                    }}
                                />
                                <p className="text-xs tracking-wide">{book.book_name}</p>
                            </>
                            
                        )
                    }
                    if (key === "BookAuthor") {
                        return (
                            <>
                                <p className="text-xs tracking-wide">{book.book_author[0] || "None"}</p>
                                {book.book_author.length > 1 &&
                                    <div 
                                        className="py-0.25 px-1.5 flex gap-x-0.5 justify-center items-center bg-blue-950/75 rounded-sm"
                                    >
                                        <span className={clsx("text-[10px] text-blue-500 font-bold", nunito.className)}>
                                            {book.book_author.length - 1}
                                        </span>
                                        <PlusIcon
                                            size={8}
                                            strokeWidth={3}
                                            className="stroke-blue-500"
                                        />
                                    </div>
                                }
                            </>
                            
                        )
                    }
                    return <></>;
                }}
            />
            <NavigationBar
                filter={filterBooks}
            />
        </>
    )
}