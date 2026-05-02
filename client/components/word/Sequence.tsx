import { ParenthesizedSequenceElement, SenseSequenceElement } from "@/services/words/getWordEntry";
import Level from "./Level";
import Sense from "./Sense";
import clsx from "clsx";
import { pixelifySans } from "@/app/fonts";

interface SequenceProps {
    sequence: SenseSequenceElement[];
    sequenceNum: number;
}

export default function Sequence(props: SequenceProps) {
    return (
        <div className="grid grid-cols-[auto_1fr]">
            <Level
                label={props.sequenceNum}
                level={0}
                long={props.sequence.length > 1}
            />
            <div className="flex flex-col gap-y-2">
                {props.sequence.map((sense: SenseSequenceElement, i: number) => (
                    <div key={i}>
                        {(sense[0] === "sense" || sense[0] === "sen" || sense[0] === "bs") &&
                            <div className="grid grid-cols-[auto_1fr]">
                                {/* Check for Letters */}
                                {(props.sequence.length > 1 && sense[0] !== "bs" && sense[1]["sn"] && /[a-z]/i.test(sense[1]["sn"])) &&
                                    <Level
                                        label={sense[1]["sn"].replaceAll(' ', '').at(-1) || ''}
                                        level={1}
                                    />
                                }
                                <Sense
                                    sense={sense}
                                />
                            </div>
                        }
                        {(sense[0] === "pseq") && (
                            <div className="grid grid-cols-[auto_1fr]">
                                <Level
                                    label={'abcdefghijklmnopqrstuvwxyz'[i]}
                                    level={1}
                                    long={sense[1].length > 1}
                                />
                                <div className="flex flex-col gap-y-2">
                                    {sense[1].map((partialSense: ParenthesizedSequenceElement, p: number) => (
                                        <div 
                                            key={p}
                                            className="flex text-white"
                                        >
                                            {/* Check for Numbers */}
                                            {partialSense[0] !== 'bs' &&
                                                <span 
                                                    className={clsx(
                                                        pixelifySans.className,
                                                        "w-6 min-w-6 overflow-clip block font-bold text-xs text-blue-400 text-center whitespace-nowrap"
                                                    )}
                                                >
                                                    [{partialSense[1].sn?.match(/\((\d+)\)/)?.[1]}]
                                                </span>
                                            }
                                            <Sense
                                                sense={partialSense}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}