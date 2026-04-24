import words from "an-array-of-english-words";

export default function getAutoCompletion(value: string, size: number = 10) {
    if (value.length <= 0)
        return [];
    
    const suggestions = words.filter(w => w.startsWith(value)).slice(0, size);
    return suggestions;
}