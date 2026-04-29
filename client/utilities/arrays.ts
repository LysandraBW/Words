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