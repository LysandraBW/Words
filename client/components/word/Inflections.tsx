import { Inflections } from "@/services/words/getWordEntry";

interface InflectionProps {
    ins: Inflections;
}

export default function Inflection(props: InflectionProps) {
    return (
        <>
            {props.ins.every(inf => !("il" in inf)) ? 
                <div className="text-neutral-100 tracking-wider text-md font-medium">
                    {props.ins.map(inf => inf.if).join("; ").replaceAll('*', '')}
                </div>
                :
                <div className="my-1 flex flex-wrap gap-2">
                    {props.ins.map((inf, i) => (
                        <div 
                            key={i}
                            className="flex gap-x-2 px-2 py-0.5 bg-neutral-800 border border-neutral-700 rounded-md shadow-sm"
                        >
                            <span className="text-white tracking-wider text-sm !text-neutral-500">
                                {inf.il}{' '}
                                <span className="text-white tracking-wider text-sm !text-neutral-400 font-medium">
                                    {inf.if}
                                </span>
                            </span>
                        </div>
                    ))}
                </div>
            }
        </>
    )
}