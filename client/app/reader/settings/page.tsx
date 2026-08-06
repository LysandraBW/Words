"use client";
import InputButton from "@/components/input/InputButton";
import InputText from "@/components/input/InputText";
import { ReaderType, selectReader } from "@/services/server/reader";
import { LaughIcon, PencilIcon, SmileIcon, StarIcon, Trash2Icon, UserIcon, UserXIcon } from "lucide-react";
import { useEffect, useState } from "react";
import NavBarTab from "../NavBarTab";
import Button from "@/components/Button";
import ProfilePicture from "@/components/ProfilePicture";
import { createForm, Form, updateFormValue } from "@/utilities/form";
import z from "zod";

export default function Page() {
    const [tabIndex, setTabIndex] = useState(0);
    const [reader, setReader] = useState<ReaderType>();

    const [form, setForm] = useState<Form<any>>(createForm([
        {
            label: "name",
            value: '',
            test: z.string().trim().min(1, "Must enter a name.")
        },
        {
            label: "email",
            value: '',
            test: z.string().trim().min(1, "Must enter an email address/")
        },
        {
            label: "url",
            value: '',
            test: z.url().trim().optional()
        },
        {
            label: "password",
            value: '',
            test: z.string().optional()
        },
        {
            label: "confirm_password",
            value: '',
            test: z.string().optional()
        }
    ]));


    useEffect(() => {
        const load = async () => {
            const reader = await selectReader();
            setReader(reader[0]);
        }
        load();
    }, []);


    return (
        <div className="h-full max-h-full grid grid-rows-[auto_1fr]">
            <h1 className="px-4 py-4 text-2xl text-neutral-100 font-medium bg-neutral-900 border-b border-b-neutral-800">
                Settings
            </h1>
            <div className="min-h-0 -grow grid grid-cols-[200px_1fr] grid-rows-1 overflow-auto">
                <div className="w-full h-full p-4 flex flex-col gap-y-3 bg-neutral-900 border-r border-r-neutral-800">
                    <NavBarTab
                        TabIcon={UserIcon}
                        tabLabel="Account Details"
                        selected={tabIndex === 0}
                        onClick={() => setTabIndex(0)}
                    />
                    <NavBarTab
                        TabIcon={UserXIcon}
                        tabLabel="Delete Account"
                        selected={tabIndex === 1}
                        onClick={() => setTabIndex(1)}
                    />
                </div>
                <>
                    {tabIndex === 0 &&
                        <div className="w-full h-full bg-neutral-900 max-h-full overflow-auto">
                            <div className="w-[400px] px-6 py-4 flex flex-col gap-y-6">
                                <InputText
                                    label="Name"
                                    value={form.name.value}
                                    onChange={(value) => setForm(updateFormValue(form, "name", value))}
                                    required={true}
                                    error={form.name.error}
                                />
                                <InputText
                                    label="Email"
                                    value={form.email.value}
                                    onChange={(value) => setForm(updateFormValue(form, "email", value))}
                                    required={true}
                                    error={form.email.error}
                                />
                                <InputText
                                    label="Profile Picture"
                                    value={form.url.value}
                                    onChange={(value) => setForm(updateFormValue(form, "url", value))}
                                    error={form.url.error}
                                />
                                <InputText
                                    label="Password"
                                    value={form.password.value}
                                    onChange={(value) => setForm(updateFormValue(form, "password", value))}
                                    required={true}
                                    error={form.password.error}
                                />
                                <InputText
                                    label="Confirm Password"
                                    value={form.confirm_password.value}
                                    onChange={(value) => setForm(updateFormValue(form, "confirm_password", value))}
                                    required={true}
                                    error={form.confirm_password.error}
                                />
                                <Button
                                    label="Save"
                                    onClick={() => 1}
                                    outerClassName="!w-full"
                                />
                            </div>
                        </div>
                    }
                    {tabIndex === 1 &&
                        <div className="px-4 py-4 w-full h-full flex flex-col gap-y-4 bg-neutral-900 max-h-full overflow-auto">
                            <div className="flex flex-col -gap-y-1">
                                <p className="text-lg text-neutral-100 font-medium">
                                    Delete Account
                                </p>
                                <p className="text-base text-neutral-400 max-w-xs">
                                    Deleting your account is a permanent action.
                                </p>
                            </div>
                            <Button
                                iconL={
                                    <Trash2Icon
                                        size={16}
                                        className="relative -top-[0.5px] text-neutral-100"
                                    />
                                }
                                label="Delete Account"
                                red
                            />
                        </div>
                    }
                </>
            </div>
        </div>
    )
}