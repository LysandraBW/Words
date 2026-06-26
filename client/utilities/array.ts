// For Array-Sets (Set-Like Arrays)
export const addValue = <T>(value: T, values: T[]) => {
    const updatedValues = new Set(values);
    updatedValues.add(value);
    return [...updatedValues];
}

export const deleteValue = <T>(value: T, values: T[]) => {
    const updatedValues = new Set(values);
    updatedValues.delete(value);
    return [...updatedValues];
}

export const toggleValue = <T>(value: T, values: T[]) => {
    if (values.includes(value))
        return deleteValue(value, values);
    return addValue(value, values);
}

export const sameArrays = <T>(a: T[], b: T[]) => {
    const aSet = new Set(a);
    const bSet = new Set(b);
    return aSet.size === bSet.size && [...aSet].every(value => bSet.has(value));
}

// Source - https://stackoverflow.com/a/2450976
// Posted by ChristopheD, modified by community. See post 'Timeline' for change history
// Retrieved 2026-06-26, License - CC BY-SA 4.0
export const shuffle = <T>(a: T[]) => {
    let currentIndex = a.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [a[currentIndex], a[randomIndex]] = [a[randomIndex], a[currentIndex]];
    }
}