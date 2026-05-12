import InputButton from "@/components/input/InputButton";
import InputText from "@/components/input/InputText";
import BookIllustration from "./illustrationBook/BookIllustration";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";
import { createForm, Form, testForm, updateFormValue } from "@/utilities/form";
import { signIn } from "@/services/server/reader";
import PageToggle from "./PageToggle";


interface LoginProps {
    page: string;
    onClickPage: (page: string) => void;
}


export default function Login(props: LoginProps) {
    const router = useRouter();
    const [form, setForm] = useState(createForm([
        {
            label: 'email',
            value: 'abc@mail.com',
            test: z.string().trim().min(1, "Must enter an email")
        },
        {
            label: 'password',
            value: '123',
            test: z.string().min(1, "Must enter a password")
        }
    ]));


    const onLogin = async (form: Form<{email: string; password: string}>) => {
        try {
            if (!testForm(form))
                throw new Error('Invalid Fields');
            
            const data = await signIn(
                form.email.value, 
                form.password.value
            );

            if (!data) 
                throw new Error("Failed");

            router.push("/home");
        }
        catch (err) {
            alert(err);
        }
    }


    return (
        <>
            <main className="h-full flex flex-col justify-between">
                <div className="relative h-full w-full p-4 flex flex-col justify-center items-center gap-y-12">
                    <div className="flex flex-col items-center gap-y-6">
                        <PageToggle
                            page={props.page}
                            onClickPage={props.onClickPage}
                        />
                        <header className="max-w-2xs flex flex-col gap-y-1">
                            <h1 className="text-3xl text-neutral-100 text-center font-medium tracking-tight">
                                Welcome Back
                            </h1>
                            <p className="text-sm text-center">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            </p>
                        </header>
                    </div>
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="max-lg:w-full max-lg:max-w-sm lg:min-w-xs flex flex-col gap-y-6"
                    >
                        <InputText
                            label="Email"
                            value={form.email.value}
                            error={form.email.error}
                            onChange={value => setForm(updateFormValue(form, 'email', value))}
                        />
                        <InputText
                            type="password"
                            label="Password"
                            value={form.password.value}
                            error={form.password.error}
                            onChange={value => setForm(updateFormValue(form, 'password', value))}
                        />
                        <div className="flex flex-col gap-y-3">
                            <InputButton
                                label="Log In"
                                onClick={() => onLogin(form)}
                            />
                            <p className="text-sm text-center">
                                Don't have an account yet?
                                <span className="ml-1 text-neutral-100 cursor-pointer">
                                    Sign Up
                                </span>
                            </p>
                        </div>
                    </form>
                </div>
                <div className="relative bottom-0 w-full h-fit self-end">
                    <p className="text-sm text-neutral-500/75 text-center whitespace-nowrap">
                        By creating an account, you agree to read.
                    </p>
                </div>
            </main>
            <BookIllustration/>
        </>
    )
}