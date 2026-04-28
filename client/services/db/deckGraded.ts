import { DeckType } from "./deck";


export interface DeckGradedType {
    deck_graded_id: number;
    duration: number;
    number_correct: number;
    number_incorrect: number;
    deck_id: number;
}


export interface DeckGradedCardType {
    choice: number;
    deck_graded_id: number;
    deck_card_id: number;
}


export async function createDeckGraded(deck: DeckGradedType, choices: [number, number][]) {
    const response = await fetch('http://127.0.0.1:8000/decksGraded', {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({...deck, choices})
    });

    if (response.status !== 200)
        return null;

    const data: {deckGraded: DeckGradedType, deckGradedCard: DeckGradedCardType[]} | null = await response.json();
    return data;
}


export async function deleteDeckGraded(deckGradedID: number) {
    const response = await fetch(`http://127.0.0.1:8000/decksGraded/${deckGradedID}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: DeckGradedType | null = await response.json();
    return data;
}


export async function getDeckGraded(deckGradedID: number) {
    const response = await fetch(`http://127.0.0.1:8000/decksGraded/${deckGradedID}`, {
        method: "GET",
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: {deckGraded: DeckGradedType, deckGradedCards: (DeckGradedType & DeckGradedCardType)[]} | null = await response.json();
    return data;
}


export async function getDecksGraded() {
    const response = await fetch('http://127.0.0.1:8000/decksGraded', {
        method: "GET",
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: (DeckType & DeckGradedType)[] | null = await response.json();
    return data;
}


export async function getDecksGradedByDeck(deckID: number) {
    const response = await fetch(`http://127.0.0.1:8000/decks/${deckID}/decksGraded`, {
        method: "GET",
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: (DeckType & DeckGradedType)[] | null = await response.json();
    return data;
}


export async function getDecksGradedByBook(bookID: number) {
    const response = await fetch(`http://127.0.0.1:8000/books/${bookID}/decksGraded`, {
        method: "GET",
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: (DeckType & DeckGradedType)[] | null = await response.json();
    return data;
}


export async function getDecksGradedByChapters(chapterID: number) {
    const response = await fetch(`http://127.0.0.1:8000/chapters/${chapterID}/decksGraded`, {
        method: "GET",
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: (DeckType & DeckGradedType)[] | null = await response.json();
    return data;
}