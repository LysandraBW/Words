"use client";
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react";
import UpdateDeck from "./UpdateDeck";
import Quiz from "./Quiz";
import Button from "@/components/Button";
import { BookIcon, TrashIcon } from "lucide-react";
import QuizGraded from "./QuizGraded";
import { reloadDeck, deleteDeck, updateDeck } from "@/services/server/deck";
import { DeckGradedType, deleteDeckGraded, insertDeckGraded } from "@/services/server/deckGraded";
import loadData from "./loadData";
import ShowWords from "@/components/ShowWords";


export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const deckID = searchParams.get('deckID');
    
    if (!deckID)
        return router.back();
    
    const [data, setData] = useState<Awaited<ReturnType<typeof loadData>>>();
    const [show, setShow] = useState<string|DeckGradedType>('');


    useEffect(() => {
        const load = async () => {
            try {
                const data = await loadData(Number(deckID));
                setData(data);
            }
            catch (err) {
                alert(err);
            }
        }
        load();
    }, []);


    const handleDeckUpdated = (output: Awaited<ReturnType<typeof updateDeck>>) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                deck: {
                    ...output,
                    deck: output.deck,
                    deckCards: output.deckCards || data.deck.deckCards
                }   
            }
        });
        setShow('');
    }


    const handleDeckGradedDeleted = (deletedDeckGraded: Awaited<ReturnType<typeof deleteDeckGraded>>) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                decksGraded: data.decksGraded.filter(deck => deck.deck_graded_id !== deletedDeckGraded.deck_graded_id),
                decksGradedCards: Object.fromEntries(
                    Object.entries(data.decksGradedCards).filter(entry => {
                            return Number(entry[0]) !== deletedDeckGraded.deck_graded_id;
                        })
                    )
            }
        });
        setShow('');
    }


    const handleDeckReloaded = (deckCards: Awaited<ReturnType<typeof reloadDeck>>) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                deck: {
                    ...data.deck,
                    deckCards
                }
            }
        });
        setShow('');
    }


    const onDeleteDeckGraded = async (deckGradedID: number) => {
        try {
            const deletedDeckGraded = await deleteDeckGraded(deckGradedID);
            handleDeckGradedDeleted(deletedDeckGraded);
        }
        catch (err) {
            alert(err);
        }
    }


    const onReloadDeck = async (deckID: number) => {
        try {
            const deckCards = await reloadDeck(deckID);
            handleDeckReloaded(deckCards);
        }
        catch (err) {
            alert(err);
        }
    }


    const handleDeckGradedCreated = (output: Awaited<ReturnType<typeof insertDeckGraded>>) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                decksGraded: [
                    ...data.decksGraded, 
                    {
                        ...data.deck.deck, 
                        ...output.deckGraded
                    }
                ],
                decksGradedCards: {
                    ...data.decksGradedCards, 
                    [output.deckGraded.deck_graded_id]: output.deckGradedCard
                }
            }
        });
        setShow('');
    }


    const onDeleteDeck = async (deckID: number) => {
        try {
            await deleteDeck(deckID);
            router.back();
        }
        catch (err) {
            alert(err);
        }
    }


    const onShowQuizResults = async (deckGraded: DeckGradedType) => {
        setShow(deckGraded);
    }


    if (!data)
        return <>Loading</>;


    return (
        <div className="h-screen overflow-y-scroll">
            <div className="flex flex-col gap-2">
                {data.deck.deck.deck_name}
                <Button
                    label="Delete Deck"
                    onClick={() => onDeleteDeck(data.deck.deck.deck_id)}
                />
                <Button
                    label="Reload Deck"
                    onClick={async () => onReloadDeck(data.deck.deck.deck_id)}
                />
                <Button
                    label="Update Deck"
                    onClick={async () => setShow('Update Deck')}
                />
                {data.decksGraded.map(deckGraded => (
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
                            Duration: {deckGraded.duration}ms
                            Number Correct: {deckGraded.number_correct}
                            Number Incorrect: {deckGraded.number_incorrect}
                        </p>
                    </div>
                ))}
            </div>
            <ShowWords
                words={data.words}
                decksGraded={data.decksGraded}
            />
            <Button
                label="Start Quiz"
                onClick={() => setShow('Quiz')}
            />
            {typeof show !== "string" && (
                <QuizGraded
                    deckCards={data.deck.deckCards}
                    deckGraded={show}
                    deckGradedCards={data.decksGradedCards[show.deck_graded_id]}
                    onClose={() => setShow('')}
                    onDelete={async () => onDeleteDeckGraded(show.deck_graded_id)}
                />
            )}
            {show === 'Update Deck' &&
                <UpdateDeck
                    books={data.books}
                    deck={data.deck.deck}
                    onDeckUpdated={handleDeckUpdated}
                    onClose={() => setShow('')}
                />
            }
            {show === 'Quiz' &&
                <Quiz
                    cards={data.deck.deckCards}
                    onQuizFinished={handleDeckGradedCreated}
                />
            }
        </div>
    )
}