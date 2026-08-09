"use client";
import loadData from "@/app/reader/home/loadData";
import { BookType, deleteBook } from "@/services/server/book";
import { DeckType, deleteDeck } from "@/services/server/deck";
import getWordEntries, { Entry } from "@/services/words/getWordEntry";
import { AlertCircleIcon, BookIcon, CircleDashedIcon, ClipboardIcon, LibraryIcon, TextInitialIcon } from "lucide-react";
import { useEffect, useState } from "react";
import BookTab from "../BookTab";
import ChapterTab from "../ChapterTab";
import WordTab from "../WordTab";
import DeckTab from "../DeckTab";
import CreateDeck from "@/app/reader/home/CreateDeck";
import CreateBook from "@/app/reader/home/CreateBook";
import Card from "./Card";
import Tab from "./Tab";
import CreateChapter from "../book/CreateChapter";
import CreateWord from "../chapter/CreateWord";
import { ChapterType, deleteChapter } from "@/services/server/chapter";
import { deleteWord, WordType } from "@/services/server/word";
import InDevelopmentBanner from "./InDevelopment";
import { toast } from "@/components/ui/toast/Toast";


export default function Page() {
    const [tabIndex, setTabIndex] = useState(0);
    
    const [data, setData] = useState<Awaited<ReturnType<typeof loadData>>>();

    const [show, setShow] = useState('');

    const [wordLookup, setWordLookup] = useState<{[word: string]: {entries: Entry[], z: number}}|null>();

    useEffect(() => {
        const load = async () => {
            try {
                const data = await loadData();
                setData(data);
            }
            catch (err) {
                alert(err);
            }
        }
        load();
    }, []);


    const handleBookCreated = (book: BookType) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                books: [
                    ...data.books, 
                    book
                ]
            }
        });
        setShow('');
    }


    const handleChapterCreated = (chapter: ChapterType) => {
        setData(data => {
            if (!data)
                return data;

            const chapterBook = data.books.find(book => book.book_id === chapter.book_id);
            if (!chapterBook)
                return data;

            return {
                ...data,
                chapters: [
                    ...data.chapters, 
                    {
                        ...chapter,
                        ...chapterBook
                    }
                ]
            }
        });
        setShow('');
    }


    const handleDeckCreated = (deck: DeckType) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                decks: [
                    ...data.decks, 
                    deck
                ]
            }
        });
        setShow('');
    }


    const handleWordCreated = (word: WordType) => {
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
        setShow('');
    }


    const handleBookDeleted = (book: BookType) => {
        setData(data => {
            if (!data)
                return data;

            const removedChapterIDs = new Set(
                data.chapters.filter(c => c.book_id === book.book_id).map(c => c.chapter_id)
            );

            return {
                ...data,
                books: data.books.filter(b => b.book_id !== book.book_id),
                chapters: data.chapters.filter(c => c.book_id !== book.book_id),
                words: data.words.filter(w => !removedChapterIDs.has(w.chapter_id))
            }
        });
        setShow('');
    }


    const handleChapterDeleted = (chapter: ChapterType) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                chapters: data.chapters.filter(c => c.chapter_id !== chapter.chapter_id),
                words: data.words.filter(w => w.chapter_id !== chapter.chapter_id)
            }
        });
        setShow('');
    }


    const handleWordDeleted = (word: WordType) => {
        console.log(word, data?.words);
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                words: data.words.filter(w => w.word_id !== word.word_id)
            }
        });
        setShow('');
    }


    const handleDeckDeleted = (deck: DeckType) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                decks: data.decks.filter(d => d.deck_id !== deck.deck_id)
            }
        });
        setShow('');
    }


    const onDeleteDecks = async (deckIDs: number[]) => {
        try {
            await Promise.all(deckIDs.map(async (id) => {
                const deletedDeck = await deleteDeck(id);
                handleDeckDeleted(deletedDeck[0]);
            }));
        }
        catch (err) {
            alert(err);
        }
    }

    
    const onDeleteBooks = async (bookIDs: number[]) => {
        try {
            await Promise.all(bookIDs.map(async (id) => {
                const deletedBook = await deleteBook(id);
                handleBookDeleted(deletedBook[0]);
            }));
        }
        catch (err) {
            toast({
                type: 'error',
                title: 'Failed to Delete',
                description: `The selected book${bookIDs.length === 1 ? 's were' : ' was'} unsuccessfully deleted.`,
            });
        }
    }


    const onDeleteChapters = async (chapterIDs: number[]) => {
        try {
            await Promise.all(chapterIDs.map(async (id) => {
                const deletedChapter = await deleteChapter(id);
                handleChapterDeleted(deletedChapter[0]);
            }));
        }
        catch (err) {
            toast({
                type: 'error',
                title: 'Failed to Delete',
                description: `The selected chapter${chapterIDs.length === 1 ? 's were' : ' was'} unsuccessfully deleted.`
            });
        }
    }


    const onDeleteWords = async (wordIDs: number[]) => {
        try {
            await Promise.all(wordIDs.map(async (id) => {
                const deletedWord = await deleteWord(id);
                handleWordDeleted(deletedWord[0]);
            }));
        }
        catch (err) {
            toast({
                type: 'error',
                title: 'Failed to Delete',
                description: `The selected word${wordIDs.length === 1 ? 's were' : ' was'} unsuccessfully deleted.`
            });
        }
    }


    const onOpenWord = async (word: string) => {
        let wordEntries = await getWordEntries(word);
        setWordLookup(showing => {
            return {
                ...showing,
                [word]: {
                    entries: wordEntries,
                    z: 100
                }
            }
        });
    }


    const onCloseWord = (word: string) => {
        setWordLookup(showing => {
            const updatedShowing = {...showing};
            delete updatedShowing[word];
            return updatedShowing;
        });
    }


    const onBringWordToFront = (word: string) => {
        setWordLookup(lookup => {
            if (!lookup)
                return lookup;
            return Object.fromEntries(
                Object.entries(lookup).map(([w, i]) => {
                    i.z = w === word ? 200 : 100
                    return [w, i];
                })
            );
        })
    }


    return (
        <div className="grid grid-cols-1 grid-rows-[auto_auto_1fr]">
            <div className="h-min p-4 flex gap-x-4 border-b border-b-neutral-800">
                <Card
                    Icon={CircleDashedIcon}
                    cardKey='Card Key'
                    cardValue="1000"
                    cardValueChange={70}
                    cardKeyContext="in a Month"
                />
                <Card
                    Icon={CircleDashedIcon}
                    cardKey='Card Key'
                    cardValue="500"
                    cardValueChange={90}
                    cardKeyContext="in a Month"
                />
                <Card
                    Icon={CircleDashedIcon}
                    cardKey='Card Key'
                    cardValue="75%"
                    cardValueChange={50}
                    cardKeyContext="in a Month"
                />
                <Card
                    Icon={CircleDashedIcon}
                    cardKey='Card Key'
                    cardValue="100"
                    cardValueChange={40}
                    cardKeyContext="in a Month"
                />
            </div>
            <div className="w-full p-2 grid grid-cols-4 gap-x-2 bg-neutral-900 border-b border-b-neutral-800">
                <Tab
                    TabIcon={LibraryIcon}
                    tabLabel="Books"
                    selected={tabIndex === 0}
                    onClick={() => setTabIndex(0)}
                />
                <Tab
                    TabIcon={BookIcon}
                    tabLabel="Chapters"
                    selected={tabIndex === 1}
                    onClick={() => setTabIndex(1)}
                />
                <Tab
                    TabIcon={TextInitialIcon}
                    tabLabel="Words"
                    selected={tabIndex === 2}
                    onClick={() => setTabIndex(2)}
                />
                <Tab
                    TabIcon={ClipboardIcon}
                    tabLabel="Decks"
                    selected={tabIndex === 3}
                    onClick={() => setTabIndex(3)}
                />
            </div>
            <div className="p-2 bg-neutral-950 grid grid-rows-[auto_1fr] grid-cols-1 gap-y-2 overflow-auto">
                {tabIndex === 0 &&
                    <BookTab
                        books={data?.books || []}
                        onDelete={onDeleteBooks}
                        onCreate={() => setShow('Create Book')}
                    />
                }
                {tabIndex === 1 &&
                    <ChapterTab
                        showBook
                        chapters={data?.chapters || []}
                        onDelete={onDeleteChapters}
                        onCreate={() => setShow('Create Chapter')}
                    />
                }
                {tabIndex === 2 &&
                    <WordTab
                        words={data?.words || []}
                        decksGraded={data?.decksGraded || []}
                        onDelete={onDeleteWords}
                        onCreate={() => setShow('Create Word')}
                        // Lookup
                        lookup={wordLookup || null}
                        onOpenWord={onOpenWord}
                        onCloseWord={onCloseWord}
                        onBringWordToFront={onBringWordToFront}
                        setLookup={setWordLookup}
                    />
                }
                {tabIndex === 3 &&
                    <DeckTab
                        decks={data?.decks || []}
                        decksGraded={data?.decksGraded || []}
                        onCreate={() => setShow('Create Deck')}
                        onDelete={onDeleteDecks}
                    />
                }
            </div>
            {show === 'Create Deck' &&
                <CreateDeck
                    books={data?.books || []}
                    onClose={() => setShow('')}
                    onDeckCreated={handleDeckCreated}
                />
            }
            {show === 'Create Word' &&
                <CreateWord
                    books={data?.books || []}
                    chapters={data?.chapters || []}
                    onClose={() => setShow('')}
                    onWordCreated={handleWordCreated}
                    requireChapter
                />
            }
            {show === 'Create Chapter' &&
                <CreateChapter
                    books={data?.books || []}
                    onChapterCreated={handleChapterCreated}
                    onClose={() => setShow('')}
                />
            }
            {show === 'Create Book' &&
                <CreateBook
                    onClose={() => setShow('')}
                    onBookCreated={handleBookCreated}
                />
            }
        </div>
    )
}