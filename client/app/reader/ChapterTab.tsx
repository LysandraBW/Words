import useFilterObjects from "@/hooks/useFilterObject";
import { Option } from "@/components/input/InputDropdown";
import TableHead from "./home/TableHead";
import TableBody from "./home/TableBody";
import ActionBar from "./home/ActionBar/ActionBar";
import NavigationBar from "./home/Navigation";
import { ChapterType } from "@/services/server/chapter";
import { BookType } from "@/services/server/book";
import { useRouter } from "next/navigation";

interface ChapterTabProps {
    chapters: (BookType & ChapterType)[];
    onCreate: () => void;
    showBook?: boolean;
}

export default function ChapterTab(props: ChapterTabProps) {
    const router = useRouter();
    
    const filter = useFilterObjects({ 
        objects: props.chapters,
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


    return (
        <>
            <ActionBar
                searchOptions={searchOptions}
                sortOptions={sortOptions}
                filter={filter}
                onCreate={props.onCreate}
            />
            <TableHead
                columns={props.showBook ? ["Book", "Number", "Title"] : ["Number", "Title"]}
            />
            <TableBody
                objects={filter.filteredObjects}
                objectID={"chapter_id"}
                keys={props.showBook ? ["Book", "chapter_number", "chapter_title"] : ["chapter_number", "chapter_title"]}
                onClickObjectRow={(chapter: ChapterType) => router.push(`/reader/chapter?chapterID=${chapter.chapter_id}`)}
                getElementCallback={(key, chapter) => {
                    if (key === "Book") {
                        return (
                            <>
                                <div 
                                    className="w-4 h-4 bg-center bg-cover"
                                    style={{
                                        backgroundImage: `url(${chapter.book_cover_image})`
                                    }}
                                />
                                <p className="text-xs tracking-wide">{chapter.book_name}</p>
                            </>
                            
                        )
                    }
                    return <></>;
                }}
            />
            <NavigationBar
                filter={filter}
            />
        </>
    )
}