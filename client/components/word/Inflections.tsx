import { Inflections } from "@/services/words/getWordEntry";

interface InflectionProps {
    ins: Inflections;
}

export default function Inflection(props: InflectionProps) {
    return (
        <>
            {props.ins.every(inf => !("il" in inf)) ? 
                <div className="text-white tracking-wider text-lg font-medium">
                    {props.ins.map(inf => inf.if).join("; ").replaceAll('*', '')}
                </div>
                :
                <div className="flex gap-x-4">
                    {props.ins.map((inf, i) => (
                        <div 
                            key={i}
                            className="flex gap-x-2 px-2 py-0.5 border border-zinc-700 rounded-md"
                        >
                            <span className="text-white tracking-wider text-lg font-medium italic">
                                {inf.il}
                            </span>
                            <span className="text-white tracking-wider text-lg font-medium">
                                {inf.if}
                            </span>
                        </div>
                    ))}
                </div>
            }
        </>
    )
}