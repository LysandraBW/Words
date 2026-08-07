import useFilterObjects from "@/hooks/useFilterObject";
import { Option } from "@/components/input/InputDropdown";
import TableHead from "../../components/ui/table/TableHead";
import TableBody from "../../components/ui/table/TableBody";
import ActionBar from "../../components/ui/table/ActionBar";
import NavigationBar from "../../components/ui/table/Navigation";
import { ChapterType } from "@/services/server/chapter";
import { BookType } from "@/services/server/book";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ChapterTabProps {
    chapters: (BookType & ChapterType)[];
    onCreate: () => void;
    onDelete: (chapterIDs: number[]) => void;
    showBook?: boolean;
}

export default function ChapterTab(props: ChapterTabProps) {
    const router = useRouter();
    
    const [display, setDisplay] = useState("List");
    const [selected, setSelected] = useState<Set<number>>(new Set());

    const filter = useFilterObjects({ 
        objects: props.chapters.sort((a, b) => {
            return parseInt(a.chapter_number) - parseInt(b.chapter_number);
        }),
        getObjectValueCallback: (k, o) => {
            if (k === "all")
                return o.chapter_title + " " + o.chapter_number;
            return "";
        }
    });

    
    const searchOptions: Option<string>[] = [
        {
            value: "all",
            textLabel: "All"
        },
        {
            value: "chapter_title",
            textLabel: "Title"
        },
        {
            value: "chapter_number",
            textLabel: "Number"
        }
    ];


    const sortOptions: Option<string>[] = [
        {
            value: "chapter_title",
            textLabel: "Title"
        },
        {
            value: "chapter_number",
            textLabel: "Number"
        }
    ];


    const toggleAllCheckboxes = () => {
        // All Selected
        if (selected.size === 0) {
            const bookIDs = props.chapters.map(chapter => chapter.chapter_id);
            setSelected(new Set(bookIDs));
        }
        else {
            setSelected(new Set());
        }
    }


    const selectObject = (objectID: number) => {
        const updatedSelectedBooks = new Set(selected);
        updatedSelectedBooks.add(objectID);
        setSelected(updatedSelectedBooks);
    }


    const deselectObject = (objectID: number) => {
        const updatedSelectedBooks = new Set(selected);
        updatedSelectedBooks.delete(objectID);
        setSelected(updatedSelectedBooks);
    }


    return (
        <>
            <ActionBar
                searchOptions={searchOptions}
                sortOptions={sortOptions}
                filter={filter}
                onCreate={props.onCreate}
                onDelete={() => props.onDelete([...selected])}
                display={display}
                onDisplayChange={setDisplay}
            />
            <div>
                <div
                    className="grid bg-neutral-900 border border-neutral-800 border-b-0 rounded-t-lg overflow-clip"
                    style={{
                        "gridTemplateColumns": props.showBook ? 'calc(26px + 16px) 1fr 1fr' : `calc(26px + 16px) 1fr`
                    }}
                >
                    <TableHead
                        columns={props.showBook ? ["Book", "Name"] : ["Name"]}
                        allSelected={selected.size === props.chapters.length && !!props.chapters.length}
                        onToggleAllCheckboxes={toggleAllCheckboxes}
                    />
                    <TableBody
                        objectID={"chapter_id"}
                        objects={filter.filteredObjects}
                        onClickObjectRow={(chapter: ChapterType) => router.push(`/reader/chapter?chapterID=${chapter.chapter_id}`)}
                        onSelectObject={selectObject}
                        onDeselectObject={deselectObject}
                        selectedObjects={selected}
                        keys={props.showBook ? ["Book", "chapter_title"] : ["chapter_title"]}
                        getElementCallback={(key, chapter) => {
                            if (key === "Book") {
                                return (
                                    <>
                                        <div 
                                            className="w-6 h-10 bg-center bg-cover border border-neutral-600 rounded-sm"
                                            style={{
                                                backgroundImage: `url(${chapter.book_cover_image})`
                                            }}
                                        />
                                        <p className="text-sm text-neutral-400 tracking-wide">
                                            {chapter.book_name}
                                        </p>
                                    </>
                                    
                                )
                            }
                            return <></>;
                        }}
                    />
                </div>
                <NavigationBar
                    filter={filter}
                />
            </div>
        </>
    )
}