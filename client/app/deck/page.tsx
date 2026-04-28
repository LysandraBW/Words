"use client";
import { DeckCardGradedType, DeckCardType, DeckGradedType, DeckType, deleteDeck, deleteDeckGraded, getDeck, getDeckGraded, getDecksGraded } from "@/services/db/deck";
import { getReader, ReaderType } from "@/services/db/reader";
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react";
import UpdateDeck from "./UpdateDeck";
import { BookType, getBooks } from "@/services/db/book";
import Quiz from "./Quiz";
import Button from "@/components/Button";
import { useTimer } from "react-timer-hook";
import { BookIcon, TrashIcon } from "lucide-react";
import QuizGraded from "./QuizGraded";




export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [user, setUser] = useState<ReaderType>();
    const [books, setBooks] = useState<Array<BookType>>([]);
    const [deck, setDeck] = useState<DeckType>();
    const [deckCards, setDeckCards] = useState<DeckCardType[]>();
    const [decksGraded, setDecksGraded] = useState<DeckGradedType[]>([]);
    const [decksGradedCards, setDecksGradedCards] = useState<{[deckGradedID: number]: DeckCardGradedType[]}>([]);

    const [showQuizResults, setShowQuizResults] = useState<DeckGradedType|null>();
    const [showQuiz, setShowQuiz] = useState(false);
    const [showUpdateDeck, setShowUpdateDeck] = useState(false);


    useEffect(() => {
        const load = async () => {
            const user = await getReader();
            if (!user)
                return router.push('/signIn');
            setUser(user);


            const books = await getBooks();
            if (books)
                setBooks(books);

                        
            // Deck ID
            const deckID = searchParams.get("deckID");
            if (deckID === null)
                return router.push('/home');
            const deckIDAsNumber = Number(deckID);


            // Get Deck
            const deck = await getDeck(deckIDAsNumber);
            if (!deck || deck.length !== 2) {
                alert('Invalid Deck');
                return router.push('/home');
            }

            setDeck(deck[0]);
            setDeckCards(deck[1]);


            // Get Deck Graded
            const decksGraded = await getDecksGraded();
            if (decksGraded)
                setDecksGraded(decksGraded);
        }
        load();
    }, []);


    const loadGradedDeckCards = async (deckGradedID: number) => {
        const deckGraded = await getDeckGraded(deckGradedID);
        if (!deckGraded) {
            alert('Graded Deck Failed to Load');
            return;
        }

        // Update (Cache) Cards
        setDecksGradedCards({
            ...decksGradedCards, 
            [deckGraded[0].deck_graded_id]: deckGraded[1]
        });

        return deckGraded[1];
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


    const onQuizFinished = (deckGraded: DeckGradedType, deckCardGraded: DeckCardGradedType[]) => {
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

    if (!deck)
        return <></>;

    return (
        <>
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
        </>
    )
}