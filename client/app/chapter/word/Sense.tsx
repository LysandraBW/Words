import { useEffect, useState } from "react";
import FormattedText from "./FormattedText";
import Labels from "./Labels";

interface SenseProps {
    senseType?: string;
    senseData: {[k: string]: [string, any][]};
}

export default function Sense(props: SenseProps) {
    const [meaning, setMeaning] = useState("");
    const [examples, setExamples] = useState<string[]>([]);
    const [labels, setLabels] = useState<string[]>([]);

    useEffect(() => {
        const {
            meaning,
            examples,
            labels
        } = updateMeaningAndExample(props.senseData);
        setMeaning(meaning);
        setExamples(examples);
        setLabels(labels);
    }, [props.senseData]);

    const updateMeaningAndExample = (data: {[k: string]: [string, any][]}) => {
        let meaning = "";
        let example = "";
        let examples: string[] = [];
        let labels: string[] = [];
        
        // Meaning
        if ("dt" in data) {
            for (const [k, v] of data["dt"]) {
                if (k === "text") {
                    meaning = v;
                }
                else if (k === "vis") {
                    for (const example of v)
                        examples.push(example["t"]);
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
        }

        // Labels
        if ("sls" in data) {
            labels = data["sls"] as any;
        }
        
        return {
            meaning,
            example,
            examples,
            labels
        }
    }

    return (
        <div>
            {(!props.senseType || props.senseType === "sense") &&
                <>
                    <div
                        className="flex items-center"
                    >
                        <Labels
                            labels={labels}
                        />
                        <FormattedText
                            text={meaning}
                        />
                    </div>
                    <div>
                        {examples.map((example, i) => (
                            <div key={i}>
                                <FormattedText
                                    text={example}
                                />
                            </div>
                        ))}
                    </div>
                </>
            }
            {props.senseType === "sen" &&
                <div
                    className="flex items-center"
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