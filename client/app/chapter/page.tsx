"use client";
import Button from "@/components/Button";
import InputText from "@/components/input/InputText";
import Word from "@/components/word/Word";
import WordNotFound from "@/components/word/WordNotFound";
import { BookType } from "@/services/db/book";
import { ChapterType, deleteChapter, getChapter, getChapterWords, updateChapter } from "@/services/db/chapter";
import { getReader, ReaderType } from "@/services/db/reader";
import { createWord, decrementWordNumberInstances, deleteWord, incrementWordNumberInstances, WordType } from "@/services/db/word";
import getAutoCompletion from "@/services/words/getAutoCompletion";
import getWordEntry from "@/services/words/getWordEntry";
import { MinusIcon, PlusIcon, SettingsIcon, TrashIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import UpdateChapter from "./UpdateChapter";


export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<ReaderType>();
    const [chapter, setChapter] = useState<(ChapterType & BookType)>();
    const [chapterWords, setChapterWords] = useState<WordType[]>();


    useEffect(() => {
        const load = async () => {
            const user = await getReader();
            if (!user)
                return router.push('/signIn');
            setUser(user);


            // Chapter ID
            const chapterID = searchParams.get("chapterID");
            if (chapterID === null)
                return router.push('/home');
            const numberChapterID = Number(chapterID);


            // Get Chapter by ID
            const chapter = await getChapter(numberChapterID);
            if (!chapter)
                return;
            setChapter(chapter);


            // Get Book's Chapters
            const chapterWords = await getChapterWords(numberChapterID);
            setChapterWords(chapterWords || []);
        }
        load();
    }, []);
    

    // Add Word
    const [word, setWord] = useState<string>();
    const [wordEntry, setWordEntry] = useState<any>();
    
    const [showAddWord, setShowAddWord] = useState(true);
    const [showUpdateChapter, setShowUpdateChapter] = useState(true);

    const [search, setSearch] = useState("");
    const [searchDebounced] = useDebounce(search, 500);
    const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
    

    useEffect(() => {
        autoCompleteSearch(searchDebounced);
    }, [searchDebounced]);


    const autoCompleteSearch = (search: string) => {
        const suggestions = getAutoCompletion(search, 5);
        setSearchSuggestions(suggestions);
    }


    const onDeleteChapter = async (chapterID: number) => {
        const deletedChapter = await deleteChapter(chapterID);
        if (!deletedChapter) {
            alert('Failed to Delete Word');
            return;
        }

        router.back();
    }


    const onInsertWord = async (chapterID: number, word: string, wordDefinition: string) => {
        const initialWord: WordType = {
            word_id: -1,
            word: [word, wordDefinition],
            word_number_instances: 0,
            chapter_id: chapterID,
            created_at: '',
            last_seen: ''
        }

        const insertedWord = await createWord(initialWord);
        if (!insertedWord) {
            alert('Failed to Insert Word');
            return;
        }
        
        const updatedChapterWords = [...(chapterWords || []), insertedWord];
        setChapterWords(updatedChapterWords);

        return insertedWord;
    }


    const onDeleteWord = async (wordID: number) => {
        if (!chapterWords)
            return;
        
        const deletedWord = await deleteWord(wordID);
        if (!deletedWord) {
            alert('Failed to Delete Word');
            return;
        }
        
        const updatedChapterWords = chapterWords.filter(word => word.word_id !== wordID);
        setChapterWords(updatedChapterWords);

        return deletedWord;
    }


    const onIncrementWordNumberInstances = async (wordID: number) => {
        if (!chapterWords)
            return;

        const updatedWord = await incrementWordNumberInstances(wordID);
        if (!updatedWord) {
            alert('Failed to Increment Word\'s Number of Instances');
            return;
        }

        const updatedChapterWords = chapterWords.map(word => {
            if (word.word_id === wordID)
                word.word_number_instances += 1;
            return word;
        });

        setChapterWords(updatedChapterWords);
        return updatedWord;
    }


    const onDecrementWordNumberInstances = async (wordID: number) => {
        if (!chapterWords)
            return;

        const updatedWord = await decrementWordNumberInstances(wordID);
        if (!updatedWord) {
            alert('Failed to Increment Word\'s Number of Instances');
            return;
        }

        const updatedChapterWords = chapterWords.map(word => {
            if (word.word_id === wordID)
                word.word_number_instances -= 1;
            return word;
        });

        setChapterWords(updatedChapterWords);
        return updatedWord;
    }


    const onSearchWord = async (word: string) => {
        setWord(word);
        setSearch(word);

        // Get Entry
        const entry = await getWordEntry(word);
        setWordEntry(entry);
    }


    const onChapterUpdated = async (updatedChapter: ChapterType) => {
        if (!chapter)
            return;
        setChapter({...chapter, ...updatedChapter});
    }


    return (
        <div>
            <div
                className="bg-purple-400"
            >
                <h3>Book and Chapter</h3>
                <button
                    className="bg-red-500"
                    onClick={() => {
                        if (!chapter)
                            return;
                        onDeleteChapter(chapter.chapter_id);
                    }}
                >
                    Delete Chapter
                    <TrashIcon/>
                </button>
                {chapter &&
                    <>
                        <h3>
                            {chapter.book_name} {'>'} ({chapter.chapter_number}) {chapter.chapter_title}
                        </h3>
                    </>
                }
            </div>
            <div
                className="bg-blue-200"
            >
                <h3>Words</h3>
                {chapterWords && chapterWords.map((word, i) => (
                    <div key={i}>
                        <button
                            onClick={() => onDeleteWord(word.word_id)}
                        >
                            <TrashIcon/>
                        </button>
                        <p>
                            {word.word[0]}, {word.word[1]}
                        </p>
                        <button
                            onClick={() => onDecrementWordNumberInstances(word.word_id)}
                        >
                            <MinusIcon/>
                        </button>
                        {word.word_number_instances}
                        <button
                            onClick={() => onIncrementWordNumberInstances(word.word_id)}
                        >
                            <PlusIcon/>
                        </button>
                    </div>
                ))}
            </div>
            <button
                onClick={() => setShowUpdateChapter(true)}
                className="bg-pink-600"
            >
                <SettingsIcon/>
            </button>
            {(chapter && showUpdateChapter) &&
                <div>
                    <UpdateChapter
                        chapter={chapter}
                        onClose={() => setShowUpdateChapter(false)}
                        onChapterUpdated={(updatedChapter: ChapterType) => onChapterUpdated(updatedChapter)}
                    />
                </div>
            }
            <Button
                label='Add Meaning'
                onClick={() => setShowAddWord(true)}
                style="blue"
            />
            {showAddWord &&
                <div 
                    className="bg-green-500"
                >
                    <div
                        onClick={() => setShowAddWord(false)}
                    >
                        Close
                    </div>
                    <InputText
                        label="Search Word"
                        value={search}
                        onChange={setSearch}
                    />
                    {searchSuggestions.map((value, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                setSearch(value);
                                onSearchWord(value);
                            }}
                        >
                            {value}
                        </div>
                    ))}
                    {(word && wordEntry) && 
                        <>
                            {typeof wordEntry[0] === "string" ?
                                <>
                                    <WordNotFound
                                        word={word}
                                        otherWords={wordEntry}
                                        onClickWord={onSearchWord}
                                    />
                                </>
                                :
                                <>
                                    <Word
                                        word={word}
                                        wordEntries={wordEntry}
                                        onInsertWord={(word: string, wordDefinition: string) => {
                                            if (!chapter)
                                                return;
                                            onInsertWord(chapter.chapter_id, word, wordDefinition);
                                        }}
                                    />
                                </>
                            }
                        </>
                    }
                </div>
            }
        </div>
    )
}