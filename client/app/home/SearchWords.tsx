import InputDropdown from "@/components/input/InputDropdown";
import InputText from "@/components/input/InputText";
import getSuggestions from "@/services/words/getAutoCompletion";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { gamjaFlower, pixelifySans } from "../fonts";
import { RegexIcon } from "lucide-react";

interface SearchWordsProps {
    onOpenWord: (word: string) => void;
}

export default function SearchWords(props: SearchWordsProps) {
    const [value, setValue] = useState("");
    const [selected, setSelected] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);


    return (
        <div className="p-4 flex text-red-500">
            <div className="h-full px-4 flex items-center rounded-l-md bg-zinc-950 border border-zinc-800 border-r-0">
                <RegexIcon
                    size={16}
                    className="text-zinc-300"
                />
            </div>
            <InputDropdown
                value={[selected]}
                options={suggestions.map(suggestion => ({
                    value: suggestion,
                    textLabel: suggestion
                }))}
                onSearchChange={(value: string) => {
                    setSuggestions(getSuggestions(value));
                }}
                onChange={(value: string) => {
                    props.onOpenWord(value);
                }}
                wrapperClassName="w-full" 
                toggleClassName="rounded-l-none"
                optionClassName="w-full"
                search
                itemName="Words"
            />
        </div>
    )
}