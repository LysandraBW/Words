import { Fragment, useEffect, useState } from "react";
import FormattedText from "./FormattedText";
import Labels from "./Labels";
import { DotIcon, PlusIcon, PointerIcon } from "lucide-react";
import { DefiningText, ParenthesizedSequenceElement, Sense, TruncatedSense } from "@/services/words/getWordEntry";
import clsx from "clsx";


interface ShowSenseProps {
    sense: ParenthesizedSequenceElement;
    onClick?: (meaning: string) => void;
    allowLog: boolean;
}


export default function ShowSense(props: ShowSenseProps) {
    const [senseLabel, senseData] = props.sense;
    // [[meaning, "..."], ["vis", "..."], [meaning, "..."]
    const [nodes, setNodes] = useState<[string, string][]>([]);
    const [labels, setLabels] = useState<string[]>([]);


    useEffect(() => {
        const data: Sense | TruncatedSense = senseLabel === "bs" ? senseData.sense : senseData;
        
        const nodes: [string, string][] = [];
        // Meaning
        if (Object.hasOwn(data, 'dt')) {
            for (const [k, v] of (data as any)['dt'] as DefiningText) {
                if (k === "text") {
                    nodes.push(["meaning", v]);
                }
                else if (k === "vis") {
                    for (const example of v)
                        nodes.push(["example", example["t"]]);
                }
            }
        }

        // Inflection
        if (Object.hasOwn(data, 'ins')) {
            let ifs: string[] = [];
            let ils: string[] = [];
            let ifcs: string[] = [];

            for (const ins of (data as any)['ins']) {
                for (const tuple of [["if", ifs], ["il", ils], ["ifcs", ifcs]] as any) {
                    if (tuple[0] in ins)
                        tuple[1].push(ins[tuple[0]]);
                }
            }

            const meaning = [...ifs, ...ils, ...ifcs].join(";");
            nodes.push(["meaning", meaning]);
        }

        // Labels
        let labels: string[] = [];
        if ("sls" in data)
            labels = data["sls"] as any;
        
        setNodes(nodes);
        setLabels(labels);
    }, [props.sense]);


    return (
        <div className="relative grid- grid-cols-1 grid-rows-1 w-[calc(100%-0px)]">
            {labels.length !== 0 &&
                <div className="inline relative top-[-1.5px]">
                    <Labels
                        labels={labels}
                    />
                </div>
            }
            {nodes?.map((node, i) => (
                <Fragment key={i}>
                    {node[0] === "meaning" &&
                        <div 
                            className={clsx(
                                "inline-block",
                                props.allowLog && "pr-[calc(48px)]"
                            )}
                        >
                            <FormattedText
                                text={node[1]}
                            />
                            {props.allowLog &&
                                <button 
                                    onClick={() => props.onClick && props.onClick(node[1])}
                                    className="absolute top-0 right-0 w-[18px] aspect-square h-min flex justify-center items-center bg-blue-600 border border-blue-500 rounded-md shadow-sm"    
                                >
                                    <PlusIcon
                                        size={10}
                                        className="stroke-neutral-100 scale-x-95"
                                    />
                                </button>
                            }
                        </div>
                    }
                    {node[0] === "example" &&
                        <div 
                            className="grid grid-cols-[auto_1fr]"
                        >
                            <DotIcon
                                size={18}
                                className="relative top-[3px] text-xs text-neutral-500"
                            />
                            <FormattedText
                                text={node[1]}
                                isExample
                            />
                        </div>
                    }
                </Fragment>
            ))}
        </div>
    )
}