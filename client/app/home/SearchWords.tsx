import InputDropdown from "@/components/input/InputDropdown";
import getSuggestions from "@/services/words/getAutoCompletion";
import { useState } from "react";
import { BookTextIcon, BoxIcon, LibraryIcon, LightbulbIcon, SearchIcon } from "lucide-react";

interface SearchWordsProps {
    onOpenWord: (word: string) => void;
}

export default function SearchWords(props: SearchWordsProps) {
    const [selected, setSelected] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);


    return (
        <div className="p-8 flex">
            
            <InputDropdown
                value={[selected]}
                options={suggestions.map(suggestion => ({
                    value: suggestion,
                    textLabel: suggestion
                }))}
                onSearchChange={(value: string) => setSuggestions(getSuggestions(value))}
                onChange={(value: string) => props.onOpenWord(value)}
                wrapperClassName="w-full"
                toggleClassName="rounded-l-none border-l-0 pl-4"
                optionClassName="w-full"
                itemName="Words"
                toggleLabel="Search Merriam-Webster"
                search
                searchPlaceholder="Agh, what does that word mean?"
                elementLeft={(
                    <div className="h-full px-4 pr-0 flex items-center rounded-l-md border border-neutral-800 border-r-0">
                        <SearchIcon
                            size={16}
                            className="text-neutral-500"
                        />
                    </div>
                )}
                elementNeedSearch={(
                    <div className="flex flex-col gap-y-4 items-center">
                        <BoxIcon
                            strokeWidth={1.5}
                            className="text-neutral-500"
                        />
                        <header className="flex flex-col items-center gap-y-1.5">
                            <h6 className="text-white font-medium">
                                Search for a Word
                            </h6>
                            <p className="max-w-xs text-sm text-neutral-500 text-center">
                                Qu'est-ce que tu attends ? Je ne sais pas ce que j'attends. Bref, cherche un mot.
                            </p>
                        </header>
                    </div>
                )}
            />
        </div>
    )
}