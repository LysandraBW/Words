import clsx from "clsx";
import { Check, ChevronsUpDown } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import InputWrapper from "./InputWrapper";
import InputLabel from "./InputLabel";

export interface Option {
    value: string;
    textLabel?: string;
    optionLabel?: ReactNode;
}

interface InputDropdownProps {
    value: string[];
    label: string;
    error: string;
    options: Option[];
    onChange: (value: string) => void;
    toggleLabel: string;
    toggleClassName: string;
    optionClassName: string;
    search: boolean;
    searchPlaceholder: string;
    onSearchChange: (debouncedSearch: string) => void;
    itemName: string;
}

export default function InputDropdown(props: Partial<InputDropdownProps>) {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 500);

    useEffect(() => {
        if (!props.onSearchChange)
            return;
        props.onSearchChange(debouncedSearch);
    }, [debouncedSearch]);

    useEffect(() => {
        document.addEventListener('mousedown', (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node))
                setOpen(false);
        });
    }, [dropdownRef]);

    return (
        <InputWrapper>
            <InputLabel
                label={props.label}
            />
            <div 
                ref={dropdownRef}
                className="relative"
            >
                {(!props.search || (props.search && !open)) &&
                    <button
                        onClick={() => setOpen(true)}
                        className={clsx(
                            "w-full h-[36px] px-4 py-1",
                            "flex justify-between items-center",
                            "bg-zinc-900 rounded-md group",
                            "cursor-pointer",
                            props.toggleClassName
                        )}
                    >
                        <label 
                            className={clsx(
                                "text-sm text-zinc-500 tracking-wide group-hover:text-white",
                                "cursor-pointer"
                            )}
                        >
                            {props.toggleLabel}
                        </label>
                        <ChevronsUpDown
                            size={16}
                            className="text-zinc-500"
                        />
                    </button>
                }
                {(props.search && open) &&
                    <input
                        type="text"
                        value={search}
                        autoFocus
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={props.searchPlaceholder}
                        className={clsx(
                            "w-full h-[36px] px-4 py-1",
                            "flex justify-between items-center",
                            "bg-zinc-900 rounded-md outline-none focus:bg-zinc-800",
                            "text-sm text-zinc-400 tracking-wide focus:text-white",
                            props.toggleClassName
                        )}
                    />
                }
                {open &&
                    <div 
                        className={clsx(
                            "absolute top-[calc(36px+4px)]",
                            "w-full max-h-[256px] overflow-y-scroll",
                            "bg-zinc-900 rounded-md",
                            props.optionClassName
                        )}
                    >
                        {(!props.options || !props.options.length) &&
                            <div className="w-full h-full p-4 flex flex-col gap-y-0 justify-center items-center">
                                <p className="text-sm text-zinc-400 tracking-wide font-medium">
                                    {(props.search && !search) ?
                                        `Search for ${props.itemName || 'Items'}`
                                        :
                                        "No Results"
                                    }
                                </p>
                                {props.search &&
                                    <p className="max-w-[400px] text-sm text-center text-zinc-500 tracking-wide">
                                        {props.search ?
                                            'To search, you must enter something.'
                                            :
                                            'There are no options to choose from.'
                                        }
                                    </p>
                                }
                            </div>
                        }
                        {props.options?.map((option, i) => (
                            <div 
                                key={i}
                                onClick={() => props.onChange && props.onChange(option.value)}
                                className={clsx(
                                    "w-full p-2 overflow-x-clip",
                                    "grid grid-cols-[1fr_16px] gap-x-4 items-center",
                                    "bg-zinc-900 border-b border-b-zinc-800 last:border-b-0 text-white cursor-pointer",
                                    "group hover:bg-zinc-800 hover:text-blue-400"
                                )}
                            >
                                <div className="w-full grid grid-cols-1 text-inherit text-sm tracking-wide">
                                    {option.optionLabel || option.textLabel}
                                </div>
                                {props.value?.includes(option.value) &&
                                    <Check
                                        size={16}
                                    />
                                }
                            </div>
                        ))}
                    </div>
                }
            </div>
        </InputWrapper>
    )
}