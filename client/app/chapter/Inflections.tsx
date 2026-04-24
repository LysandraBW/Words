interface InflectionProps {
    ins: {[k: string]: any}[];
}

export default function Inflection(props: InflectionProps) {
    return (
        <>
            {props.ins.every(inf => !("il" in inf)) ? 
                <div className="font-bold">
                    {props.ins.map(inf => inf.if).join("; ")}
                </div>
                :
                <div className="flex gap-x-4">
                    {props.ins.map((inf, i) => (
                        <div 
                            key={i}
                            className="flex gap-x-2 border border-gray-100 bg-gray-50"
                        >
                            <span className="italic">
                                {inf.il}
                            </span>
                            <span className="font-bold">
                                {inf.if}
                            </span>
                        </div>
                    ))}
                </div>
            }
        </>
    )
}