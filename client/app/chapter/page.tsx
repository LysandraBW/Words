"use client";
import Button from "@/components/Button";
import InputText from "@/components/input/InputText";
import Word from "@/components/word/Word";
import WordNotFound from "@/components/word/WordNotFound";
import { BookType } from "@/services/db/book";
import { ChapterType, deleteChapter, selectChapter, selectChapterWords, updateChapter } from "@/services/db/chapter";
import { selectReader, ReaderType } from "@/services/db/reader";
import { insertWord, decrementWordNumberInstances, deleteWord, incrementWordNumberInstances, WordType } from "@/services/db/word";
import getAutoCompletion from "@/services/words/getAutoCompletion";
import getWordEntry from "@/services/words/getWordEntry";
import { MinusIcon, PlusIcon, SettingsIcon, TrashIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import UpdateChapter from "./UpdateChapter";
import useSortWords from "@/hooks/useSortWords";
import InputDropdown from "@/components/input/InputDropdown";
import getWordData from "@/utilities/wordData";
import { selectDecksGradedByChapters } from "@/services/db/deckGraded";


export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<ReaderType>();

    const [chapter, setChapter] = useState<(ChapterType & BookType)>();
    
    const [words, setWords] = useState<WordType[]>();
    const [wordAccuracies, setWordAccuracies] = useState<{[word: string]: number}>();
    const sortWords = useSortWords(words);


    useEffect(() => {
        const load = async () => {
            const user = await selectReader();
            if (!user)
                return router.push('/signIn');
            setUser(user);


            // Chapter ID
            const chapterID = searchParams.get("chapterID");
            if (chapterID === null)
                return router.push('/home');
            const numberChapterID = Number(chapterID);


            // Get Chapter by ID
            const chapter = await selectChapter(numberChapterID);
            if (!chapter) {
                alert('Failed');
                return;
            }
            setChapter(chapter);


            // Load Decks Graded
            const decksGraded = await selectDecksGradedByChapters(chapter.chapter_id);
            if (!decksGraded) {
                alert('Failed');
                return;
            }
            
            // Get Chapters's Words
            const words = await selectChapterWords(numberChapterID);
            if (!words) {
                alert('Failed');
                return;
            }
            setWords(words);

            // Load Word Accuracies
            const wordAccuracies = await getWordData(decksGraded, words.map(word => word.word[0]));
            setWordAccuracies(wordAccuracies);
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

        const insertedWord = await insertWord(initialWord);
        if (!insertedWord) {
            alert('Failed to Insert Word');
            return;
        }
        
        const updatedChapterWords = [...(words || []), insertedWord];
        setWords(updatedChapterWords);

        return insertedWord;
    }


    const onDeleteWord = async (wordID: number) => {
        if (!words)
            return;
        
        const deletedWord = await deleteWord(wordID);
        if (!deletedWord) {
            alert('Failed to Delete Word');
            return;
        }
        
        const updatedChapterWords = words.filter(word => word.word_id !== wordID);
        setWords(updatedChapterWords);

        return deletedWord;
    }


    const onIncrementWordNumberInstances = async (wordID: number) => {
        if (!words)
            return;

        const updatedWord = await incrementWordNumberInstances(wordID);
        if (!updatedWord) {
            alert('Failed to Increment Word\'s Number of Instances');
            return;
        }

        const updatedChapterWords = words.map(word => {
            if (word.word_id === wordID)
                word.word_number_instances += 1;
            return word;
        });

        setWords(updatedChapterWords);
        return updatedWord;
    }


    const onDecrementWordNumberInstances = async (wordID: number) => {
        if (!words)
            return;

        const updatedWord = await decrementWordNumberInstances(wordID);
        if (!updatedWord) {
            alert('Failed to Increment Word\'s Number of Instances');
            return;
        }

        const updatedChapterWords = words.map(word => {
            if (word.word_id === wordID)
                word.word_number_instances -= 1;
            return word;
        });

        setWords(updatedChapterWords);
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

    if (!chapter || !words || !wordAccuracies)
        return <></>;

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
                <h3>
                    {chapter.book_name} {'>'} ({chapter.chapter_number}) {chapter.chapter_title}
                </h3>
            </div>
            <section className="w-full px-4 py-4">
                <h3 className="mb-4 text-lg text-white font-medium tracking-tight">
                    Words
                </h3>
                <div className="flex flex-wrap gap-8">
                    <InputDropdown
                        label="Sort Words"
                        options={sortWords.sortOptions}
                        value={[sortWords.sort]}
                        onChange={(value: string) => sortWords.setSort(value)}
                    />
                    <div>
                        {words.map((word, i) => (
                            <Fragment key={i}>
                                <p 
                                    className="p-4 text-white bg-pink-500"
                                >
                                    {word.word[0]}, {word.word_number_instances}, {word.created_at || 'Null'}, {word.last_seen || 'Null'}, {wordAccuracies[word.word[0]]}
                                </p>
                            </Fragment>
                        ))}
                    </div>
                </div>
            </section>
            <div
                className="bg-blue-200"
            >
                <h3>Words</h3>
                {words.map((word, i) => (
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
            {(showUpdateChapter) &&
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