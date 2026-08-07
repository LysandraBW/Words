"use client";
import InputText from "@/components/input/InputText";
import { deleteReader, ReaderType, selectReader, updateReader, UpdateReaderType } from "@/services/server/reader";
import { Trash2Icon, UserIcon, UserXIcon } from "lucide-react";
import { useEffect, useState } from "react";
import NavBarTab from "../NavBarTab";
import Button from "@/components/Button";
import { createForm, Form, getFormData, testForm, updateFormTest, updateFormValue } from "@/utilities/form";
import z from "zod";
import { useRouter } from "next/navigation";


export default function Page() {
    const router = useRouter();
    
    const [tabIndex, setTabIndex] = useState(0);
    const [reader, setReader] = useState<ReaderType>();

    const [form, setForm] = useState<Form<UpdateReaderType & {confirm_reader_password: string}>>(createForm([
        {
            label: "reader_name",
            value: reader?.reader_name,
            test: z.string().trim().min(1, "Must enter a name.")
        },
        {
            label: "reader_email",
            value: reader?.reader_email,
            test: z.string().trim().min(1, "Must enter an email address.")
        },
        {
            label: "reader_profile_image",
            value: reader?.reader_profile_image,
            test: z.url().trim().optional()
        },
        {
            label: "reader_password",
            value: '',
            test: z.string().optional()
        },
        {
            label: "confirm_reader_password",
            value: '',
            test: z.string().optional()
        }
    ]));


    const onUpdateReader = async (form: Form<UpdateReaderType>) => {
        try {
            if (!testForm(form))
                throw new Error('Invalid Form');
            
            const updated = await updateReader(getFormData(form));
            setReader(updated[0]);
            alert('Worked');
        }
        catch (err) {
            alert(err);
        }
    }


    const onDeleteReader = async () => {
        try {
            if (!reader)
                throw new Error('Failed to Delete');

            await deleteReader(reader?.reader_id);
            router.push('/login');
        }
        catch (err) {
            alert(err);
        }
    }


    useEffect(() => {
        const load = async () => {
            const reader = await selectReader();
            setReader(reader[0]);
        }
        load();
    }, []);


    useEffect(() => {
        setForm(updateFormTest(
            form,
            "confirm_reader_password",
            z.literal(form.reader_password.value, 'Passwords must match.'),
            true
        ));
    }, [form.reader_password.value]);


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
                                    value={form.reader_name.value}
                                    onChange={(value) => setForm(updateFormValue(form, "reader_name", value))}
                                    required={true}
                                    error={form.reader_name.error}
                                />
                                <InputText
                                    label="Email"
                                    value={form.reader_email.value}
                                    onChange={(value) => setForm(updateFormValue(form, "reader_email", value))}
                                    required={true}
                                    error={form.reader_email.error}
                                />
                                <InputText
                                    label="Profile Picture"
                                    value={form.reader_profile_image.value || ''}
                                    onChange={(value) => setForm(updateFormValue(form, "reader_profile_image", value))}
                                    error={form.reader_profile_image.error}
                                />
                                <InputText
                                    label="New Password"
                                    value={form.reader_password.value}
                                    onChange={(value) => setForm(updateFormValue(form, "reader_password", value))}
                                    required={true}
                                    error={form.reader_password.error}
                                />
                                <InputText
                                    label="Confirm New Password"
                                    value={form.confirm_reader_password.value}
                                    onChange={(value) => setForm(updateFormValue(form, "confirm_reader_password", value))}
                                    required={true}
                                    error={form.confirm_reader_password.error}
                                />
                                <Button
                                    label="Save"
                                    onClick={() => onUpdateReader(form)}
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
                                label="Delete Account"
                                onClick={onDeleteReader}
                                iconL={
                                    <Trash2Icon
                                        size={14}
                                        className="relative -top-[0.5px] stroke-neutral-400 group-hover:stroke-red-500"
                                    />
                                }
                                red
                            />
                        </div>
                    }
                </>
            </div>
        </div>
    )
}