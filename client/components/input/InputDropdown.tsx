import clsx from "clsx";
import { Check, ChevronsUpDown } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import InputWrapper from "./InputWrapper";
import InputLabel from "./InputLabel";

export interface Option<V> {
    value: V;
    textLabel?: string;
    optionLabel?: ReactNode;
}

interface InputDropdownProps<V> {
    value: V[];
    label: string;
    error: string;
    options: Option<V>[];
    onChange: (value: V) => void;
    toggleLabel: string;
    toggleClassName: string;
    optionClassName: string;
    search: boolean;
    searchPlaceholder: string;
    onSearchChange: (debouncedSearch: string) => void;
    itemName: string;
    wrapperClassName: string;
    elementLeft: ReactNode;
    elementRight: ReactNode;
    elementNoResultsFound: ReactNode;
    elementNeedSearch: ReactNode;
}

export default function InputDropdown<V>(props: Partial<InputDropdownProps<V>>) {
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
        <InputWrapper 
            className={props.wrapperClassName}
        >
            <InputLabel
                label={props.label}
            />
            <div 
                ref={dropdownRef}
                className="relative flex"
            >
                {props.elementLeft && props.elementLeft}
                {(!props.search || (props.search && !open)) &&
                    <button
                        onClick={() => setOpen(true)}
                        className={clsx(
                            "w-full h-[36px] max-h-[36px] min-h-[36px] px-4",
                            "flex justify-between items-center",
                            "rounded-md border border-neutral-800",
                            !props.search && "cursor-pointer",
                            props.toggleClassName
                        )}
                    >
                        <label 
                            className={clsx(
                                "text-sm text-neutral-500 tracking-wide",
                                !props.search && "cursor-pointer",
                            )}
                        >
                            {props.toggleLabel}
                        </label>
                        {!props.search &&
                            <ChevronsUpDown
                                size={16}
                                className="text-neutral-500"
                            />
                        }
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
                            "w-full h-[36px] max-h-[36px] min-h-[36px] px-4",
                            "flex justify-between items-center",
                            "rounded-md border border-neutral-800 outline-none",
                            "text-sm text-neutral-500 tracking-wide focus:text-white placeholder:text-sm placeholder:text-neutral-500",
                            props.toggleClassName
                        )}
                    />
                }
                {props.elementRight && props.elementRight}
                {open &&
                    <div 
                        className={clsx(
                            "absolute top-[calc(36px+4px)] z-50",
                            "max-h-[256px] overflow-y-auto",
                            "bg-black border border-neutral-800 rounded-md",
                            props.optionClassName
                        )}
                    >
                        {!props.options?.length &&
                            <div className="w-full h-full p-8 flex flex-col gap-y-0 justify-center items-center">
                                {(props.search || search) &&
                                    props.elementNoResultsFound    
                                }
                                {(props.search && !search) &&
                                    props.elementNeedSearch    
                                }
                            </div>
                        }
                        {props.options?.map((option, i) => (
                            <div 
                                key={i}
                                onClick={() => props.onChange && props.onChange(option.value)}
                                className={clsx(
                                    "p-2 overflow-x-clip",
                                    "grid grid-cols-[auto_16px] gap-x-4 items-center",
                                    " border-b border-b-neutral-800 last:border-b-0 text-white cursor-pointer",
                                    "group hover: hover:text-blue-400"
                                )}
                            >
                                <div className="text-inherit text-sm tracking-wide">
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