export interface ReaderType {
    reader_id: string;
    reader_name: string;
    reader_email: string;
}

export async function getReader() {
    const response = await fetch('http://127.0.0.1:8000/readers', {
        credentials: "include"
    });
    if (response.status !== 200)
        return null;
    const data: ReaderType | null = await response.json();
    return data;
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