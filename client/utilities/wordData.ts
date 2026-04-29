import { selectDeck } from "@/services/db/deck";
import { DeckGradedType, selectDeckGraded } from "@/services/db/deckGraded";


export interface WordData {
    count: number;
    correct: number;
    accuracy: number;
}


export default async function getWordData(decksGraded: DeckGradedType[], allowed?: string[]): Promise<{[word: string]: WordData}> {
    const data = await Promise.all(decksGraded.map(async (deck: any) => {
        const fullDeck = await selectDeck(deck.deck_id);
        if (!fullDeck)
            throw new Error('Failed to Load Deck');

        const fullDeckGraded = await selectDeckGraded(deck.deck_graded_id);
        if (!fullDeckGraded)
            throw new Error('Failed to Load Graded Deck');

        return {
            fullDeck, 
            fullDeckGraded
        };
    }));

    const fullDecksGraded = data.map(d => d.fullDeckGraded);
    const fullDeckToDeckCards = Object.fromEntries(data.map(d => [d.fullDeck.deck.deck_id, d.fullDeck.deckCards]));
    
    const words: {[word: string]: WordData} = {};

    for (const fullDeckGraded of fullDecksGraded) {
        const deckID = fullDeckGraded.deckGraded.deck_id;
        
        for (const deckGradedCard of fullDeckGraded.deckGradedCards) {
            const deckCards = fullDeckToDeckCards[deckID];
            
            // Find Card
            // We need to find the card to find the word.
            const deckCard = deckCards.find(deckCard => deckCard.deck_card_id === deckGradedCard.deck_card_id);
            if (!deckCard) 
                throw new Error('Failed to Find Deck Card');

            // Find Word
            const word = deckCard.words[0][0];

            // Not Allowed
            if (allowed && !allowed.includes(word))
                continue
            
            if (!(word in words)) {
                words[word] = {
                    count: 0,
                    correct: 0,
                    accuracy: 0
                }
            }

            words[word].count += 1;
            if (deckGradedCard.choice === 0) 
                words[word].correct += 1;
        }
    }

    // Calculate Word Accuracy
    const alpha = 1;
    const beta = 1;
    for (const word of Object.keys(words)) {
        words[word].accuracy = (words[word].correct + alpha) / (words[word].count + alpha + beta);
    }
    
    return words;
}