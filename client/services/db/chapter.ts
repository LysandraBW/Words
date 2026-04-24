export interface ChapterType {
    chapter_id: number;
    chapter_title: string;
    chapter_number: string;
    book_id: number;
}

export async function createChapter(chapter: ChapterType) {
    console.log(chapter);
    
    const response = await fetch('http://127.0.0.1:8000/chapters', {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(chapter)
    });

    if (response.status !== 200)
        return null;

    const data: ChapterType[] = await response.json();
    return data;
}

export async function updateChapter(chapter: ChapterType) {
    const response = await fetch(`http://127.0.0.1:8000/chapters/${chapter.chapter_id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(chapter)
    });

    if (response.status !== 200)
        return null;

    const data: ChapterType[] = await response.json();
    return data;
}

export async function deleteChapter(chapterID: number) {
    const response = await fetch(`http://127.0.0.1:8000/chapters/${chapterID}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (response.status !== 200)
        return null;

    const data: ChapterType[] = await response.json();
    return data;
}