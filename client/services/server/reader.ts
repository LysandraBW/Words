export interface ReaderType {
    reader_id: string;
    reader_name: string;
    reader_email: string;
    reader_profile_image: string | null;
}

export interface UpdateReaderType {
    reader_id: string;
    reader_name: string;
    reader_email: string;
    reader_profile_image: string | null;
    reader_password: string;
}

export async function selectReader() {
    const response = await fetch('http://127.0.0.1:8000/readers', {
        credentials: "include"
    });
    
    if (response.status !== 200)
        throw new Error(`Response (${response.status})`)
    
    const data: ReaderType[] | null = await response.json();
    if (!data)
        throw new Error('Operation Failed');

    return data;
}


export async function updateReader(reader: UpdateReaderType) {
    const response = await fetch('http://127.0.0.1:8000/readers', {
        method: 'PUT',
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "credentials": "include",
        },
        body: JSON.stringify(reader)
    });
    
    if (response.status !== 200)
        throw new Error(`Response (${response.status})`)
    
    const data: ReaderType[] | null = await response.json();
    if (!data)
        throw new Error('Operation Failed');

    return data;
}

export async function deleteReader(readerID: string) {
    const response = await fetch(`http://127.0.0.1:8000/readers`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (response.status !== 200)
        throw new Error(`Response (${response.status})`);
    
    return;
}

export async function signIn(email: string, password: string) {
    const response = await fetch('http://127.0.0.1:8000/readers/signIn', {
        method: 'POST',
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "credentials": "include",
        },
        body: JSON.stringify({ 
            reader_email: email,
            reader_password: password
        })
    });

    return response.status === 200;
}


export async function signUp(name: string, email: string, password: string) {
    const response = await fetch('http://127.0.0.1:8000/readers/signUp', {
        method: 'POST',
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "credentials": "include",
        },
        body: JSON.stringify({ 
            reader_name: name,
            reader_email: email,
            reader_password: password
        })
    });

    return response.status === 200;
}


export async function signOut() {
    const response = await fetch('http://127.0.0.1:8000/readers/signOut', {
        method: 'POST',
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "credentials": "include",
        }
    });

    return response.status === 200;
}