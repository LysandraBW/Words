"use client";
import { selectReader, ReaderType } from "@/services/server/reader";
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, Fragment } from "react";
import UpdateDeck from "./UpdateDeck";
import { BookType, selectBooks } from "@/services/server/book";
import Quiz from "./Quiz";
import Button from "@/components/Button";
import { BookIcon, TrashIcon } from "lucide-react";
import QuizGraded from "./QuizGraded";
import { DeckType, DeckCardType, selectDeck, reloadDeck, deleteDeck, selectDeckWords } from "@/services/server/deck";
import { DeckGradedType, DeckGradedCardType, selectDecksGradedByDeck, selectDeckGraded, deleteDeckGraded } from "@/services/server/deckGraded";
import { WordType } from "@/services/server/word";
import useSortWords from "@/hooks/useSortWords";
import getWordData from "@/utilities/wordData";
import InputDropdown from "@/components/input/InputDropdown";


export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<ReaderType>();

    const [books, setBooks] = useState<Array<BookType>>([]);

    // Deck and the Deck's Cards
    const [deck, setDeck] = useState<DeckType>();
    const [deckCards, setDeckCards] = useState<DeckCardType[]>();

    // Graded Decks (Results)
    // and the Graded Cards for Each Graded Deck
    const [decksGraded, setDecksGraded] = useState<DeckGradedType[]>([]);
    const [decksGradedCards, setDecksGradedCards] = useState<{[deckGradedID: number]: DeckGradedCardType[]}>([]);

    // Words
    const [words, setWords] = useState<WordType[]>();
    const [wordAccuracies, setWordAccuracies] = useState<{[word: string]: number}>();
    const sortWords = useSortWords(words);

    // Rendering
    const [showQuizResults, setShowQuizResults] = useState<DeckGradedType|null>();
    const [showQuiz, setShowQuiz] = useState(false);
    const [showUpdateDeck, setShowUpdateDeck] = useState(false);


    useEffect(() => {
        const load = async () => {
            const user = await selectReader();
            if (!user)
                return router.push('/signIn');
            setUser(user);


            const books = await selectBooks();
            if (books)
                setBooks(books);

                        
            // Deck ID
            const deckID = searchParams.get("deckID");
            if (deckID === null)
                return router.push('/home');
            const deckIDAsNumber = Number(deckID);


            // Get Deck
            const output = await selectDeck(deckIDAsNumber);
            if (!output) {
                alert('Invalid Deck');
                return router.push('/home');
            }
            setDeck(output.deck);
            setDeckCards(output.deckCards);


            // Get Deck Graded
            const decksGraded = await selectDecksGradedByDeck(output.deck.deck_id);
            if (!decksGraded) {
                alert('Failed 1');
                return;
            }
            setDecksGraded(decksGraded);

            // Words
            const words = await selectDeckWords(output.deck.deck_id);
            if (!words) {
                alert('Failed 2');
                return;
            }
            setWords(words);
            
            const wordAccuracies = await getWordData(decksGraded, words.map(word => word.word[0]));
            setWordAccuracies(wordAccuracies);
        }
        load();
    }, []);


    const loadGradedDeckCards = async (deckGradedID: number) => {
        const deckGraded = await selectDeckGraded(deckGradedID);
        if (!deckGraded) {
            alert('Graded Deck Failed to Load');
            return;
        }

        // Update (Cache) Cards
        setDecksGradedCards({
            ...decksGradedCards, 
            [deckGraded.deckGraded.deck_graded_id]: deckGraded.deckGradedCards
        });

        return deckGraded.deckGradedCards;
    }


    const onDeckUpdated = (deck: DeckType, deckCards: DeckCardType[] | null) => {
        setDeck(deck);
        if (deckCards)
            setDeckCards(deckCards);
        setShowUpdateDeck(false);
    }


    const onDeleteDeckGraded = async (deckGradedID: number) => {
        const deletedDeckGraded = await deleteDeckGraded(deckGradedID);
        if (!deletedDeckGraded) {
            alert('Failed to Delete Graded Deck');
            return false;
        }

        // Updated Graded Decks
        const updatedDecksGraded = decksGraded.filter(decksGraded => decksGraded.deck_graded_id !== deletedDeckGraded.deck_graded_id);
        setDecksGraded(updatedDecksGraded);

        // Updated Graded Decks' Cards
        const updatedDecksGradedCards = {...decksGradedCards};
        delete updatedDecksGradedCards[deletedDeckGraded.deck_graded_id];
        setDecksGradedCards(updatedDecksGradedCards);

        return true;
    }


    const onQuizFinished = (deckGraded: DeckGradedType, deckCardGraded: DeckGradedCardType[]) => {
        setDecksGraded([...decksGraded, deckGraded]);
        setDecksGradedCards({...decksGradedCards, [deckGraded.deck_graded_id]: deckCardGraded});
        setShowQuiz(false);
        return;
    }


    const onShowQuizResults = async (deckGraded: DeckGradedType) => {
        const gradedDeckCards = deckGraded.deck_graded_id in decksGradedCards ? decksGradedCards[deckGraded.deck_graded_id] : await loadGradedDeckCards(deckGraded.deck_graded_id);
        if (!gradedDeckCards) {
            alert('Failed to Load Graded Deck Cards');
            return;
        }
        setShowQuizResults(deckGraded);
    }


    const onReloadDeck = async (deckID: number) => {
        const deckCards = await reloadDeck(deckID);
        if (!deckCards) {
            alert('Failed to Reload Deck');
            return;
        }
        setDeckCards(deckCards);
    }


    if (!deck || !words || !wordAccuracies)
        return <></>;

    return (
        <div
            className="h-screen overflow-y-scroll"
        >
            <div
                className="flex flex-col gap-2"
            >
                {deck.deck_name}
                <Button
                    label="Delete Deck"
                    onClick={async () => {
                        const deletedDeck = await deleteDeck(deck.deck_id);
                        if (!deletedDeck) {
                            alert('Failed to Delete Deck');
                            return;
                        }
                        router.back();
                    }}
                />
                <Button
                    label="Reload Deck"
                    onClick={async () => onReloadDeck(deck.deck_id)}
                />
                <Button
                    label="Update Deck"
                    onClick={async () => setShowUpdateDeck(true)}
                />
                {decksGraded && decksGraded.map((deckGraded, i) => (
                    <div 
                        key={deckGraded.deck_graded_id}
                        className="bg-gray-500"
                    >
                        <TrashIcon
                            onClick={() => onDeleteDeckGraded(deckGraded.deck_graded_id)}
                        />
                        <BookIcon
                            onClick={() => onShowQuizResults(deckGraded)}
                        />
                        <p>
                            Number Correct: {deckGraded.number_correct}
                        </p>
                        <p>
                            Number Incorrect: {deckGraded.number_incorrect}
                        </p>
                        <p>
                            Duration: {deckGraded.duration}ms
                        </p>
                    </div>
                ))}
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
            {(showQuizResults && decksGradedCards[showQuizResults.deck_graded_id] && deckCards && showQuizResults) && (
                <>
                    <QuizGraded
                        deckCards={deckCards}
                        deckGraded={showQuizResults}
                        deckGradedCards={decksGradedCards[showQuizResults.deck_graded_id]}
                        onClose={() => setShowQuizResults(null)}
                        onDelete={async () => {
                            const output = await onDeleteDeckGraded(showQuizResults.deck_graded_id);
                            if (!output) {
                                alert('Failed to Delete');
                                return;
                            }
                            setShowQuizResults(null);
                        }}
                    />
                </>
            )}
            {(showUpdateDeck && deck) &&
                <UpdateDeck
                    books={books}
                    deck={deck}
                    onDeckUpdated={onDeckUpdated}
                    onClose={() => setShowUpdateDeck(false)}
                />
            }
            <Button
                label="Start Quiz"
                onClick={() => setShowQuiz(true)}
            />
            {(showQuiz && deckCards) &&
                <Quiz
                    deckCards={deckCards}
                    onQuizFinished={onQuizFinished}
                />
            }
        </div>
    )
}