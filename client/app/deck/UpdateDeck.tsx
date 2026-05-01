import Button from "@/components/Button";
import InputCheckboxes from "@/components/input/InputCheckbox/InputCheckboxes";
import InputText from "@/components/input/InputText";
import { BookType, selectBookChapters, selectBookWords } from "@/services/server/book";
import { ChapterType, selectChapterWords } from "@/services/server/chapter";
import { DeckType, updateDeck } from "@/services/server/deck"
import { WordType } from "@/services/server/word";
import { sameArrays, toggleValue } from "@/utilities/array";
import { createForm, Form, getFormData, testForm, updateFormValue } from "@/utilities/form";
import { useEffect, useState } from "react";
import z from "zod";


interface UpdateDeckProps {
    deck: DeckType;
    books: BookType[];
    onClose: () => void;
    onDeckUpdated: (deck: Awaited<ReturnType<typeof updateDeck>>, words: WordType[]) => void;
}


export default function UpdateDeck(props: UpdateDeckProps) {
    const [words, setWords] = useState<WordType[]>();
    const [bookToChaptersToWords, setBookToChaptersToWords] = useState<{[bookID: number]: [ChapterType, WordType[]][]}>(); 
    const [form, setForm] = useState<Form<DeckType>>(createForm([
        {
            label: 'deck_name',
            value: props.deck.deck_name,
            test: z.any()
        },
        {
            label: 'deck_words',
            value: props.deck.deck_words,
            test: z.any()
        }
    ]));


    useEffect(() => {
        const load = async () => {
            try {
                // Load Data
                // Structure: [book, [chapter, [words]]]
                const data: [number, [ChapterType, WordType[]][]][] = await Promise.all(props.books.map(async book => {
                    return [
                        book.book_id,
                        await selectBookChapters(book.book_id).then(async chapters => await Promise.all(chapters.map(async chapter => {
                            return [
                                chapter,
                                await selectChapterWords(chapter.chapter_id)
                            ]
                        })))
                    ];
                }));

                const words: WordType[] = [];
                const booksToChaptersToWords: {[bookID: number]: [ChapterType, WordType[]][]} = {};
                for (const [bookID, chaptersToWords] of data) {
                    // Initialize Book Entry
                    if (!(bookID in booksToChaptersToWords))
                        booksToChaptersToWords[bookID] = [];
                    for (const [chapter, chapterWords] of chaptersToWords) {
                        booksToChaptersToWords[bookID].push([chapter, chapterWords]);
                        words.push(...chapterWords);
                    }
                }
                setWords(words);
                setBookToChaptersToWords(booksToChaptersToWords);
            }
            catch (err) {
                alert(err);
            }
        }
        load();
    }, [props.books]);


    if (!words || !bookToChaptersToWords)
        return <>Loading</>;


    const onUpdateDeck = async (form: Form<DeckType>) => {
        try {
            if (!testForm(form))
                throw new Error('Invalid Form');

            const deck = getFormData(form);
            const updatedDeck = await updateDeck({
                deck_id: props.deck.deck_id,
                deck_name: deck.deck_name,
                deck_words: sameArrays(props.deck.deck_words, deck.deck_words) ? null : deck.deck_words
            });

            // Updated Words
            // We could just call the function to load all the words.
            // But, I'd feel like that would be wasteful. We already
            // have all the words!
            const updatedWords = words.filter(word => deck.deck_words.includes(word.word_id));
            props.onDeckUpdated(updatedDeck, updatedWords);
        }
        catch (err) {
            alert(err);
        }
    }


    const onToggleChapter = (chapterID: number) => {
        setForm(form => updateFormValue(
            form, 
            'deck_words', 
            toggleValue(chapterID, form.deck_words.value)
        ));
    }


    


    return (
        <div>
            <InputText
                label={"Deck Name"}
                value={form.deck_name.value}
                onChange={(value: string) => setForm(updateFormValue(form, 'deck_name', value))}
            />
            {props.books.map((book, i) => (
                <div 
                    key={i}
                    className="flex flex-col gap-y-2"
                >
                    <h3><b>{book.book_name}</b></h3>
                    {bookToChaptersToWords[book.book_id].map(([chapter, words], i) => (
                        <div key={i}>
                            {chapter.chapter_title}
                            <InputCheckboxes
                                value={form.deck_words.value}
                                options={words.map(word => ({
                                    value: word.word_id,
                                    textLabel: word.word[0]
                                }))}
                                onChange={onToggleChapter}
                            />
                        </div>
                    ))}
                </div>
            ))}
            <Button
                label="Update Deck"
                onClick={() => onUpdateDeck(form)}
            />
        </div>
    )
}