"use client";
import { DeckCardType, DeckType, getDeck } from "@/services/db/deck";
import { getReader, ReaderType } from "@/services/db/reader";
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react";
import UpdateDeck from "./UpdateDeck";
import { BookType, getBooks } from "@/services/db/book";
import Quiz from "./Quiz";
import Button from "@/components/Button";

export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [user, setUser] = useState<ReaderType>();
    const [books, setBooks] = useState<Array<BookType>>([]);
    const [deck, setDeck] = useState<DeckType>();
    const [deckCards, setDeckCards] = useState<DeckCardType[]>();

    const [showQuiz, setShowQuiz] = useState(true);
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

            setDeck(deck[0][0]);
            setDeckCards(deck[1]);
        }
        load();
    }, []);


    const onDeckUpdated = (deck: DeckType, deckCards: DeckCardType[] | null) => {
        setDeck(deck);
        if (deckCards)
            setDeckCards(deckCards);
        setShowUpdateDeck(false);
    }


    return (
        <>
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
                />
            }
        </>
    )
}