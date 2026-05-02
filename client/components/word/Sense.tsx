import { Fragment, useEffect, useState } from "react";
import FormattedText from "./FormattedText";
import Labels from "./Labels";
import { DotIcon } from "lucide-react";


interface SenseProps {
    senseType?: string;
    senseData: {[k: string]: [string, any][]};
}


export default function Sense(props: SenseProps) {
    const [meaning, setMeaning] = useState("");
    const [examples, setExamples] = useState<string[]>([]);
    const [labels, setLabels] = useState<string[]>([]);

    // [[meaning, "..."], ["vis", "..."], [meaning, "..."]
    const [nodes, setNodes] = useState<[string, string][]>([]);


    useEffect(() => {
        const data = props.senseType === "bs" ? props.senseData.sense : props.senseData as any;
        const {meaning, examples, labels} = updateMeaningAndExample(data);
        setLabels(labels);
        setMeaning(meaning);
        setExamples(examples);
    }, [props.senseData]);


    const updateMeaningAndExample = (data: {[k: string]: [string, any][]}) => {
        let meaning = "";
        let example = "";
        let examples: string[] = [];
        let labels: string[] = [];

        const nodes: [string, string][] = [];
        
        // Meaning
        if ("dt" in data) {
            for (const [k, v] of data["dt"]) {
                if (k === "text") {
                    meaning = v;
                    nodes.push(["meaning", v]);
                }
                else if (k === "vis") {
                    for (const example of v) {
                        nodes.push(["example", example["t"]]);
                        examples.push(example["t"]);
                    }
                    example = examples[0];
                }
            }
        }

        // Inflection
        if ("ins" in data) {
            let ifs: string[] = [];
            let ils: string[] = [];
            let ifcs: string[] = [];

            for (const ins of data["ins"]) {
                for (const tuple of [["if", ifs], ["il", ils], ["ifcs", ifcs]] as any) {
                    if (tuple[0] in ins)
                        tuple[1].push(ins[tuple[0]]);
                }
            }

            meaning = [...ifs, ...ils, ...ifcs].join(";");
            nodes.push(["meaning", meaning]);
        }

        // Labels
        if ("sls" in data) {
            labels = data["sls"] as any;
        }
        
        setNodes(nodes);
        return {
            meaning,
            example,
            examples,
            labels
        }
    }


    return (
        <div>
            {(!props.senseType || props.senseType === "sense" || props.senseType === "bs") &&
                <>
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
                                    className="flex"
                                >
                                    <DotIcon
                                        size={18}
                                        className="text-sm text-zinc-500"
                                    />
                                    <FormattedText
                                        text={node[1]}
                                        isExample
                                    />
                                </div>
                            }
                        </Fragment>
                    ))}
                    {/* <span>
                        <Labels
                            labels={labels}
                        />
                        <FormattedText
                            text={meaning}
                        />
                    </span>
                    <div>
                        {examples.map((example, i) => (
                            <div 
                                key={i}
                                className="flex"
                            >
                                <DotIcon
                                    size={18}
                                    className="text-sm text-zinc-500"
                                />
                                <FormattedText
                                    text={example}
                                    isExample
                                />
                            </div>
                        ))}
                    </div> */}
                </>
            }
            {props.senseType === "sen" &&
                <div
                    className="flex"
                >
                    <FormattedText
                        text={meaning}
                    />
                    <Labels
                        labels={labels}
                    />
                </div>
            }
        </div>
    )
}