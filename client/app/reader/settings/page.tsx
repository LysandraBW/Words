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
        <div className="h-full max-h-full grid grid-rows-[auto_1fr] bg-neutral-900">
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
                        <div className="w-full h-full px-6 py-4 bg-neutral-950/50 max-h-full overflow-auto">
                            <div className="mb-4 flex flex-col -gap-y-1">
                                <p className="block text-lg text-neutral-100 font-medium">
                                    Account Details
                                </p>
                                <p className="text-sm text-neutral-500 max-w-xs">
                                    The fields marked with a red star are required.
                                </p>
                            </div>
                            <div className="w-[400px] flex flex-col gap-y-6">
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
                        <div className="px-6 py-4 w-full h-full flex flex-col gap-y-4 bg-neutral-950/50 max-h-full overflow-auto">
                            <div className="mb-4 flex flex-col -gap-y-1">
                                <p className="text-lg text-neutral-100 font-medium">
                                    Delete Account
                                </p>
                                <p className="text-sm text-neutral-500 max-w-xs">
                                    Deleting your account is a permanent action. You will not be able to restore your account after.
                                </p>
                            </div>
                            <Button
                                iconL={
                                    <Trash2Icon
                                        size={14}
                                        className="relative -top-[0.5px] stroke-neutral-400 group-hover:stroke-red-500"
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