import InputDropdown from "@/components/input/InputDropdown";
import getSuggestions from "@/services/words/getAutoCompletion";
import { useState } from "react";
import { SearchIcon } from "lucide-react";

interface SearchWordsProps {
    onOpenWord: (word: string) => void;
}

export default function SearchWords(props: SearchWordsProps) {
    const [selected, setSelected] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);


    return (
        <div className="w-full h-full flex">
            <InputDropdown
                value={[selected]}
                options={suggestions.map((suggestion, i) => ({
                    value: suggestion,
                    textLabel: suggestion,
                    optionLabel: (
                        <div className="flex items-center">
                            {suggestion}
                        </div>
                    )
                }))}
                onSearchChange={(value: string) => setSuggestions(getSuggestions(value))}
                onChange={(value: string) => props.onOpenWord(value)}
                wrapperClassName="w-full !h-full !min-h-full rounded-md"
                toggleClassName="!h-full !min-h-full pl-4 bg-neutral-800 border-l-0 !border-neutral-700 !rounded-r-md rounded-l-none !text-sm placeholder:!text-sm placeholder:!tracking-normal"
                optionsContainerClassName="!w-full !bg-neutral-900 !border-neutral-800 !rounded-md"
                optionContainerClassName="!py-2 !border-b !border-b-neutral-800 last:!border-b-0 group hover:!bg-neutral-900"
                optionClassName="!text-neutral-500/75 !text-sm group-hover:!text-neutral-400 tracking-wide"
                itemName="Words"
                toggleLabel="Search Merriam-Webster"
                toggleLabelClassName="!text-sm"
                search
                searchPlaceholder="Search Merriam-Webster"
                
                elementLeft={(
                    <div className="h-full px-4 flex items-center bg-neutral-800 border border-neutral-700 rounded-l-md">
                        <SearchIcon
                            size={18}
                            className="text-neutral-500/75"
                        />
                    </div>
                )}
                elementNoResultsFound={(
                    <div className="flex flex-col items-center">
                        <h6 className="text-neutral-500 font-medium">
                            No Results Found
                        </h6>
                        <p className="mt-1 max-w-[256px] text-center">
                            Maybe try a different spelling.
                        </p>
                    </div>
                )}
            />
        </div>
    )
}