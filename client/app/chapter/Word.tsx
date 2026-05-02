import { ReactNode, useEffect, useState } from "react";
import Button from "../../components/Button";
import Inflection from "../../components/word/Inflections";
import Sense from "../../components/word/Sense";
import InputDropdown, { Option } from "../../components/input/InputDropdown";

interface WordProps {
    word: string;
    wordEntries: any;
    onInsertWord: (word: string, definition: string) => void;
}

export default function Word(props: WordProps) {
    const [selectedDefinition, setSelectedDefinition] = useState([""]);
    const [definitionOptions, setDefinitionOptions] = useState<Option<string>[]>([]);

    useEffect(() => {
        if (!props.wordEntries)
            return;
        const options = loadShortDefinitionOptions(props.wordEntries);
        setDefinitionOptions(options);
    }, [props.wordEntries])


    const loadShortDefinitionOptions = (wordEntries: any) => {
        const shortDefs: Option<string>[] = [];
        for (const entry of wordEntries) {
            for (const def of entry.shortdef) {
                if (def)
                    shortDefs.push({
                        value: def,
                        textLabel: def
                    });
            }
        }
        return shortDefs;
    }


    return (
        <>
            <InputDropdown
                label="Select Word Definition"
                value={selectedDefinition}
                options={definitionOptions}
                onChange={(value: string) => setSelectedDefinition([value])}
                toggleLabel={selectedDefinition && selectedDefinition[0]}
            />
            <Button
                label="Add Word"
                onClick={() => props.onInsertWord(props.word, selectedDefinition[0])}
            />
            {props.wordEntries && props.wordEntries.filter((entry: any) => entry.def).map((entry: any, i: number) => (
                <div 
                    key={i}
                    className="mb-10 flex flex-col bg-gray-50"
                >
                    <b>
                        {entry.meta.id.split(":")[0]}
                    </b>
                    {entry.fl}
                    {entry.ins &&
                        <Inflection
                            ins={entry.ins}
                        />
                    }
                    {entry.def.map((def: any, j: number) => (
                        <div 
                            key={j}
                            className="pl-4 flex flex-col gap-y-4 bg-gray-50"
                        >
                            {def.vd && def.vd}
                            {def.sls && def.sls.map((label: string, i: number) => (
                                <span key={i}>
                                    {label}
                                </span>
                            ))}
                            {def.sseq.map((seq: any, k: number) => (
                                <div 
                                    key={k}
                                    className="pl-4 flex flex-col gap-y-1 bg-gray-50"
                                >
                                    {seq.map((sense: any, x: number) => (
                                        <div key={x}>
                                            {
                                                ["sense", "sen"].includes(sense[0]) ?
                                                    <div key={x}>
                                                        <div>
                                                            <div className="flex">
                                                                <span className="block w-10 text-right">
                                                                    {sense[1]["sn"]}
                                                                </span>
                                                                <span className="block">
                                                                    <Sense
                                                                        senseType={sense[0]}
                                                                        senseData={sense[1]}
                                                                    />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                :
                                                    <div>
                                                        
                                                    </div>
                                            }
                                            {sense[0] === "pseq" &&
                                                <>
                                                    {sense[1].map((partialSense: any, y: number) => (
                                                        <div key={y}>
                                                            <div>
                                                                <div className="flex">
                                                                    <span className="block w-10 text-right">
                                                                        {partialSense[1]["sn"]}
                                                                    </span>
                                                                    <span className="block">
                                                                        <Sense
                                                                            senseType={partialSense[0]}
                                                                            senseData={partialSense[1]}
                                                                        />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                            }
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </>
    )
}