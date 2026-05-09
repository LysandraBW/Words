"use client";

import Button from "@/components/Button";
import Logo from "@/components/Logo";
import InputButton from "@/components/input/InputButton";
import InputText from "@/components/input/InputText";
import { signIn } from "@/services/server/reader";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const router = useRouter();

    const [email, setEmail] = useState("abc@gmail.com");
    const [emailErrorMessage, setEmailErrorMessage] = useState("");

    const [password, setPassword] = useState("123");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");


    const onSignIn = async (email: string, password: string) => {
        try {
            const isValidEmail = checkEmail(email);
            const isValidPassword = checkPassword(password);
            if (!isValidEmail || !isValidPassword)
                return;

            const data = await signIn(email, password);
            if (!data) {
                alert("Failed");
                return;
            }
            router.push("/home");
        }
        catch (err) {
            alert(err);
        }
    }


    const checkEmail = (email: string): boolean => {
        const isValidEmail = !!email.length;
        setEmailErrorMessage(isValidEmail ? "" : "Must enter email.");
        return isValidEmail;
    }


    const checkPassword = (password: string): boolean => {
        const isValidPassword = !!password.length;
        setPasswordErrorMessage(isValidPassword ? "" : "Must enter password.");
        return isValidPassword;
    }


    const onChangeEmail = (email: string): void => {
        setEmail(email);
        checkEmail(email);        
    }


    const onChangePassword = (password: string): void => {
        setPassword(password);
        checkPassword(password);        
    }
    

    return (
        <div className="h-screen px-4 py-4 flex flex-col gap-y-8 justify-center items-center overflow-clip bg-black">
            <header className="flex flex-col gap-y-4 items-center">
                <h1 className="text-center text-3xl text-white font-medium tracking-tight">
                    Login
                </h1>
                <p className="max-w-xs text-sm text-center text-neutral-500 tracking-wide">
                    Plunge into the depths of your bequeathed account by entering the associated email and password.
                </p>
            </header>
            <form 
                onSubmit={(e) => e.preventDefault()}
                
                
            >
                <InputText
                    value={email}
                    label="Email"
                    error={emailErrorMessage}
                    onChange={onChangeEmail}
                />
                <InputText
                    value={password}
                    label="Password"
                    error={passwordErrorMessage}
                    onChange={onChangePassword}
                />
                <Button
                    label="Sign In"
                    style="white"
                    onClick={() => onSignIn(email, password)}
                />
            </form>
        </div>
    )
}