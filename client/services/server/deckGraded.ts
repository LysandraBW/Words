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


export type CreateDeckGradedType = Omit<DeckGradedType, "deck_graded_id">


export async function insertDeckGraded(deck: CreateDeckGradedType, choices: [number, number][]) {
    const response = await fetch('http://127.0.0.1:8000/decksGraded', {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({...deck, choices})
    });

    if (response.status !== 200)
        throw new Error(`Response (${response.status})`);

    const data: {deckGraded: DeckGradedType, deckGradedCard: DeckGradedCardType[]} | null = await response.json();
    if (!data)
        throw new Error('Operation Failed');

    return data;
}


export async function deleteDeckGraded(deckGradedID: number) {
    const response = await fetch(`http://127.0.0.1:8000/decksGraded/${deckGradedID}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (response.status !== 200)
        throw new Error(`Response (${response.status})`);

    const data: DeckGradedType | null = await response.json();
    if (!data)
        throw new Error('Operation Failed');

    return data;
}


export async function selectDeckGraded(deckGradedID: number) {
    const response = await fetch(`http://127.0.0.1:8000/decksGraded/${deckGradedID}`, {
        method: "GET",
        credentials: "include"
    });

    if (response.status !== 200)
        throw new Error(`Response (${response.status})`);

    const data: {deckGraded: DeckGradedType, deckGradedCards: (DeckGradedType & DeckGradedCardType)[]} | null = await response.json();
    if (!data)
        throw new Error('Operation Failed');

    return data;
}


export async function selectDecksGraded() {
    const response = await fetch('http://127.0.0.1:8000/decksGraded', {
        method: "GET",
        credentials: "include"
    });

    if (response.status !== 200)
        throw new Error(`Response (${response.status})`);

    const data: (DeckType & DeckGradedType)[] | null = await response.json();
    if (!data)
        throw new Error('Operation Failed');

    return data;
}


export async function selectDecksGradedByDeck(deckID: number) {
    const response = await fetch(`http://127.0.0.1:8000/decks/${deckID}/decksGraded`, {
        method: "GET",
        credentials: "include"
    });

    if (response.status !== 200)
        throw new Error(`Response (${response.status})`);

    const data: (DeckType & DeckGradedType)[] | null = await response.json();
    if (!data)
        throw new Error('Operation Failed');

    return data;
}


export async function selectDecksGradedByBook(bookID: number) {
    const response = await fetch(`http://127.0.0.1:8000/books/${bookID}/decksGraded`, {
        method: "GET",
        credentials: "include"
    });

    if (response.status !== 200)
        throw new Error(`Response (${response.status})`);

    const data: (DeckType & DeckGradedType)[] | null = await response.json();
    if (!data)
        throw new Error('Operation Failed');

    return data;
}


export async function selectDecksGradedByChapters(chapterID: number) {
    const response = await fetch(`http://127.0.0.1:8000/chapters/${chapterID}/decksGraded`, {
        method: "GET",
        credentials: "include"
    });

    if (response.status !== 200)
        throw new Error(`Response (${response.status})`);

    const data: (DeckType & DeckGradedType)[] | null = await response.json();
    if (!data)
        throw new Error('Operation Failed');

    return data;
}