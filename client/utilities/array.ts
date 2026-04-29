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