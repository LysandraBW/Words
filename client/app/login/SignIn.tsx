import InputButton from "@/components/input/InputButton";
import InputText from "@/components/input/InputText";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";
import { createForm, Form, testForm, updateFormValue } from "@/utilities/form";
import { signIn } from "@/services/server/reader";
import PageToggle from "./PageToggle";


interface SignInProps {
    page: string;
    onClickPage: (page: string) => void;
}


export default function SignIn(props: SignInProps) {
    const router = useRouter();
    const [form, setForm] = useState(createForm([
        {
            label: 'email',
            value: 'abc@gmail.com',
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
        <div className="flex flex-col grow justify-center gap-y-12">
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
                </div>
            </form>
        </div>
    )
}