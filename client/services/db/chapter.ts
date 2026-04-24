export interface ChapterType {
    chapter_id: number;
    chapter_title: string;
    chapter_number: string;
    book_id: number;
}

export async function getChapter(chapter_id: number) {}