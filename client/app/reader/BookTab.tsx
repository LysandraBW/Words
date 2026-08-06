import useFilterObjects from "@/hooks/useFilterObject";
import { BookType } from "@/services/server/book";
import { Option } from "@/components/input/InputDropdown";
import TableHead from "../../components/ui/table/TableHead";
import TableBody from "../../components/ui/table/TableBody";
import ActionBar from "../../components/ui/table/ActionBar";
import NavigationBar from "../../components/ui/table/Navigation";
import { PlusIcon } from "lucide-react";
import clsx from "clsx";
import { snigletFont } from "../fonts";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BookTabProps {
    books: BookType[];
    onCreate: () => void;
    onDelete: () => void;
}

export default function BookTab(props: BookTabProps) {
    const router = useRouter();
    
    const [display, setDisplay] = useState("List");
    const [selectedBooks, setSelectedBooks] = useState<Set<number>>(new Set());


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


    const toggleAllCheckboxes = () => {
        // All Selected
        if (selectedBooks.size === 0) {
            const bookIDs = props.books.map(book => book.book_id);
            setSelectedBooks(new Set(bookIDs));
        }
        else {
            setSelectedBooks(new Set());
        }
    }


    const selectBook = (bookID: number) => {
        const updatedSelectedBooks = new Set(selectedBooks);
        updatedSelectedBooks.add(bookID);
        setSelectedBooks(updatedSelectedBooks);
    }


    const deselectBook = (bookID: number) => {
        const updatedSelectedBooks = new Set(selectedBooks);
        updatedSelectedBooks.delete(bookID);
        setSelectedBooks(updatedSelectedBooks);
    }


    return (
        <>
            <ActionBar
                searchOptions={bookSearchOptions}
                sortOptions={bookSortOptions}
                filter={filterBooks}
                onCreate={props.onCreate}
                onDelete={props.onDelete}
                display={display}
                onDisplayChange={setDisplay}
            />
            <div>
                <div
                    className="grid bg-neutral-900 border border-neutral-800 border-b-0 rounded-t-lg overflow-clip"
                    style={{
                        "gridTemplateColumns": `calc(26px + 16px) 1fr 1fr 1fr`
                    }}
                >
                    <TableHead
                        columns={["Name", "Author", "Year"]}
                        allSelected={selectedBooks.size === props.books.length && !!props.books.length}
                        onToggleAllCheckboxes={toggleAllCheckboxes}
                    />
                    <TableBody
                        objectID={"book_id"}
                        objects={filterBooks.filteredObjects}
                        onClickObjectRow={(book: BookType) => router.push(`/reader/book?bookID=${book.book_id}`)}
                        onSelectObject={selectBook}
                        onDeselectObject={deselectBook}
                        selectedObjects={selectedBooks}
                        keys={["BookName", "BookAuthor", "book_year"]}
                        getElementCallback={(key, book) => {
                            if (key === "BookName") {
                                return (
                                    <>
                                        <div 
                                            className="w-6 h-10 bg-center bg-cover border border-neutral-600 rounded-sm"
                                            style={{
                                                backgroundImage: `url(${book.book_cover_image})`
                                            }}
                                        />
                                        <p className="text-sm text-neutral-400 tracking-wide">
                                            {book.book_name}
                                        </p>
                                    </>
                                    
                                )
                            }
                            if (key === "BookAuthor") {
                                return (
                                    <>
                                        <p className="text-sm text-neutral-400 tracking-wide">
                                            {book.book_author[0] || "None"}
                                        </p>
                                        {book.book_author.length > 1 &&
                                            <div 
                                                className="py-0.25 px-1.5 flex gap-x-0.5 justify-center items-center bg-blue-600/10 rounded-lg"
                                            >
                                                <span className={clsx("text-xs text-blue-500")}>
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
                </div>
                <NavigationBar
                    filter={filterBooks}
                />
            </div>
        </>
    )
}