"use client";

import Logo from "@/components/Logo";
import InputButton from "@/components/input/InputButton";
import InputText from "@/components/input/InputText";
import { signIn } from "@/services/db/reader";
import { CircleAlert } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const router = useRouter();

    const [email, setEmail] = useState("abc@gmail.com");
    const [emailErrorMessage, setEmailErrorMessage] = useState("");

    const [password, setPassword] = useState("123");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

    const onSignIn = async (email: string, password: string) => {
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
        <div className="w-screen h-screen grid grid-cols-2 bg-black">
            <div className="w-full flex">
                <div className="w-[calc(100%/3)] h-full bg-red-500">

                </div>
                <div className="w-[calc(100%/3)] h-full bg-blue-500">

                </div>
                <div className="w-[calc(100%/3)] h-full bg-yellow-400">

                </div>
            </div>
            <div className="w-full row-start-1 col-start-2 flex flex-col justify-between bg-black overflow-clip">
                <div className="h-full px-4 py-4 flex flex-col gap-y-8 justify-center items-center">
                    <div className="flex flex-col items-center">
                        <Logo
                            spanClassName="!text-[32px]"
                        />
                        <header className="flex flex-col gap-y-1">
                            <h1 className="text-center text-4xl text-white font-medium tracking-tight">
                                Ready to Learn
                            </h1>
                            <p className="w-[min(100%,300px)] max-w-[300px] text-center text-zinc-400 tracking-wide">
                                Plunge into the depths of your bequeathed account by entering the associated email and password.
                            </p>
                        </header>
                    </div>
                    <form 
                        onSubmit={(e) => e.preventDefault()}
                        className="min-w-[min(100%,300px)] flex flex-col gap-y-4"
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
                        <InputButton
                            label="Sign In"
                            style="blue"
                            onClick={() => onSignIn(email, password)}
                        />
                    </form>
                </div>
                {/* <div className="p-2 flex justify-center">
                    <p className="text-center text-gray-600 text-nowrap">
                        Thou has not yet fashioned an account?
                        <a 
                            href="/signUp"
                            className="ml-1 font-medium text-black cursor-pointer"
                        >
                            Sign Up
                        </a>
                    </p>
                </div> */}
            </div>
        </div>
    )
}