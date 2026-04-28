import { DeckCardType, DeckType, getDeck } from "@/services/db/deck";
import { DeckGradedType, getDeckGraded, getDecksGraded } from "@/services/db/deckGraded";

export default async function getWordAccuracies(decksGraded: DeckGradedType[], allowedWords?: string[]) {
    const deckToDeckCards: {[deckID: number]: {deck: DeckType, deckCards: DeckCardType[]}} = Object.fromEntries(
        await Promise.all(decksGraded.map(async (deck: any) => [
            deck.deck_id, 
            await getDeck(deck.deck_id)
        ])
    ));

    const words: {[word: string]: {count: number; correct: number}} = {};

    for (const deck of decksGraded) {
        const output = await getDeckGraded(deck.deck_graded_id);
        if (!output) {
            return null;
        }

        for (const card of output.deckGradedCards) {
            const cards = deckToDeckCards[output.deckGraded.deck_id];
            if (!cards) {
                return null;
            }
            
            const deckCard = cards.deckCards.find(deckCard => deckCard.deck_card_id === card.deck_card_id);
            if (!deckCard) {
                alert('Failure in Finding Deck\'s Cards');
                return;
            }

            const word = deckCard.words[0][0];

            // Word Not Allowed
            if (allowedWords && !allowedWords.includes(word))
                continue
            
            if (!(word in words)) {
                words[word] = {
                    count: 0,
                    correct: 0
                }
            }

            words[word].count += 1;
            if (card.choice === 0) 
                words[word].correct += 1;
        }
    }

    const allWords = Object.keys(words);
    const wordAccuracies: any = {};
    const a = 1; // Alpha
    const b = 1; // Beta
    for (const word of allWords) {
        wordAccuracies[word] = (words[word].correct + a) / (words[word].count + a + b);
    }
    
    return wordAccuracies;
}