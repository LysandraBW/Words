import { ChapterType } from "@/services/server/chapter"
import { useRouter } from "next/navigation";

interface ShowChaptersProps {
    chapters: ChapterType[];
}


export default function ShowChapters(props: ShowChaptersProps) {
    const router = useRouter();
    
    return (
        <>
            {props.chapters.map((chapter, i) => (
                <div 
                    key={i}
                    onClick={() => router.push(`/chapter?chapterID=${chapter.chapter_id}`)}
                >
                    {chapter.chapter_id}, {chapter.chapter_number}, {chapter.chapter_title}
                </div>
            ))}
        </>
    )
}