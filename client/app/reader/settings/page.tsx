"use client";
import InputButton from "@/components/input/InputButton";
import InputText from "@/components/input/InputText";
import { ReaderType, selectReader } from "@/services/server/reader";
import { LaughIcon, PencilIcon, SmileIcon, StarIcon, Trash2Icon, UserIcon, UserXIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page() {
    const tabs = ["Account", "Delete"];
    const [tabIndex, setTabIndex] = useState(0);

    const [reader, setReader] = useState<ReaderType>();


    useEffect(() => {
        const load = async () => {
            const reader = await selectReader();
            setReader(reader[0]);
        }
        load();
    }, []);


    return (
        <div className="h-full max-h-full grid grid-rows-[auto_1fr]">
            <h1 className="px-8 py-6 text-2xl text-neutral-100 font-medium bg-neutral-900 border-b border-b-neutral-800">
                Settings
            </h1>
            <div className="min-h-0 -grow grid grid-cols-[232px_1fr] grid-rows-1 overflow-auto">
                <div className="w-full h-full p-4 flex flex-col gap-y-3 bg-neutral-900 border-r border-r-neutral-800">
                    <button className="w-full px-2 py-1 flex items-center gap-x-2 bg-neutral-950/50 rounded-md">
                        <UserIcon
                            size={14}
                            className="text-neutral-400"
                        />
                        <span className="text-sm font-medium text-neutral-300">
                            Account Details
                        </span>
                    </button>
                    <button className="w-full px-2 py-1 flex items-center gap-x-2 rounded-md">
                        <UserXIcon
                            size={14}
                            className="text-neutral-500"
                        />
                        <span className="text-sm font-medium text-neutral-500">
                            Delete Account
                        </span>
                    </button>
                </div>
                <>
                    {tabIndex === 0 &&
                        <div className="w-full h-full bg-neutral-900 max-h-full overflow-auto">
                            <div
                                className="p-4 flex gap-x-4 border-b border-b-neutral-800"
                            >
                                <div 
                                    className="relative w-25 min-w-25 h-25 min-h-25 aspect-square rounded-lg bg-cover bg-center border border-neutral-700 shadow-md"
                                    style={{
                                        backgroundImage: `url(https://m.media-amazon.com/images/S/pv-target-images/5620550b7170b1c281665e148fca399e353c95a68f63195d3c1fa887b8c9dd5d.jpg)`
                                    }} 
                                >
                                    <div className="absolute -bottom-3 -right-3 rounded-lg p-1 bg-neutral-900">
                                        <button className="w-6 aspect-square flex justify-center items-center rounded-md bg-neutral-800 border border-neutral-700 shadow-md">
                                            <PencilIcon
                                                size={12}
                                                className="text-neutral-500"
                                            />
                                        </button>
                                    </div>
                                </div>
                                <div className="w-full flex justify-between">
                                    <div className="flex flex-col -space-y-1">
                                        <p className="text-lg text-neutral-200 font-medium">
                                            {reader?.reader_name}
                                        </p>
                                        <p className="text-base text-neutral-500 tracking-wide">
                                            {reader?.reader_email}
                                        </p>
                                    </div>
                                    <div className="flex items-end">
                                        {/* <span className="px-2 py-0.5 flex items-center gap-x-1 text-sm text-neutral-100 bg-blue-600 border border-blue-500 rounded-md shadow-md">
                                            <StarIcon
                                                size={14}
                                                className="text-neutral-200"
                                            />
                                            22-Year User
                                        </span> */}
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-4 flex flex-col gap-y-6">
                                <InputText
                                    label="Name"
                                />
                                <InputText
                                    label="Email"
                                />
                                <InputText
                                    label="Profile Picture"
                                />
                                <InputText
                                    label="Password"
                                />
                                <InputText
                                    label="Confirm Password"
                                />
                                <InputButton
                                    label="Save"
                                    onClick={() => 1}
                                />
                            </div>
                        </div>
                    }
                    {tabIndex === 1 &&
                        <div className="px-4 py-4 w-full h-full flex flex-col gap-y-4 bg-neutral-900 max-h-full overflow-auto">
                            <div className="flex flex-col gap-y-1">
                                <p className="text-lg text-neutral-100">
                                    Delete Account
                                </p>
                                <p className="text-base text-neutral-400">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                </p>
                            </div>
                            <button className="w-min px-4 py-2 flex items-center gap-x-2 bg-red-900 border border-red-800 rounded-md shadow">
                                <Trash2Icon
                                    size={16}
                                    className="relative -top-[0.5px] text-neutral-300"
                                />
                                <label className="text-neutral-100 whitespace-nowrap">
                                    Delete Account
                                </label>
                            </button>
                        </div>
                    }
                </>
            </div>
        </div>
    )
}