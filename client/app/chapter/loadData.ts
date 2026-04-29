import { selectChapter, selectChapterWords } from "@/services/server/chapter";
import { selectDecksByChapter } from "@/services/server/deck";
import { selectDecksGradedByChapters } from "@/services/server/deckGraded";
import { Dispatch, SetStateAction } from "react";
import { ChapterType } from "@/services/server/chapter";
import { WordType } from "@/services/server/word";


export default async function loadData(chapterID: number) {
    const [chapter, words, decks, decksGraded] = await Promise.all([
        (async () => {
            const chapter = await selectChapter(chapterID);
            return chapter;
        })(),
        (async () => {
            const words = await selectChapterWords(chapterID);
            return words;
        })(),
        (async () => {
            const decks = await selectDecksByChapter(chapterID);
            return decks;
        })(),
        (async () => {
            const decksGraded = await selectDecksGradedByChapters(chapterID);
            return decksGraded;
        })()
    ]);

    return {
        chapter,
        words,
        decks,
        decksGraded
    }
}


export function useDataHandlers(setData: Dispatch<SetStateAction<Awaited<ReturnType<typeof loadData>> | undefined>>) {
    const handleChapterUpdated = async (chapter: ChapterType) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                chapter: {
                    ...data.chapter,
                    ...chapter
                }
            }
        });
    }


    const handleWordCreated = async (word: WordType) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                words: [
                    ...data.words, 
                    word
                ]
            }
        });
    }


    const handleWordDeleted = async (word: WordType) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                words: data.words.filter(w => w.word_id !== word.word_id)
            }
        });
    }


    const handleWordIncremented = async (word: WordType) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                words: data.words.map(w => {
                    if (w.word_id !== word.word_id)
                        return w;
                    w.word_number_instances += 1;
                    return w;
                })
            }
        });
    }


    const handleWordDecremented = async (word: WordType) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                words: data.words.map(w => {
                    if (w.word_id !== word.word_id)
                        return w;
                    w.word_number_instances -= 1;
                    return w;
                })
            }
        });
    }

    return {
        handleChapterUpdated,
        handleWordCreated,
        handleWordDecremented,
        handleWordDeleted,
        handleWordIncremented
    }
}