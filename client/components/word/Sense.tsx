import { Fragment, useEffect, useState } from "react";
import FormattedText from "./FormattedText";
import Labels from "./Labels";
import { DotIcon, PointerIcon } from "lucide-react";
import { DefiningText, ParenthesizedSequenceElement, Sense, TruncatedSense } from "@/services/words/getWordEntry";


interface ShowSenseProps {
    sense: ParenthesizedSequenceElement;
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
        <div>
            <Labels
                labels={labels}
            />
            {nodes?.map((node, i) => (
                <Fragment key={i}>
                    {node[0] === "meaning" &&
                        <FormattedText
                            text={node[1]}
                        />
                    }
                    {node[0] === "example" &&
                        <div 
                            className="grid grid-cols-[auto_1fr] items-center"
                        >
                            <PointerIcon
                                size={18}
                                className="text-xs text-zinc-500 mr-1"
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