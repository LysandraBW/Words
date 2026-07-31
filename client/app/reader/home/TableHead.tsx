import InputCheckbox from "@/components/input/InputCheckbox/InputCheckbox";

interface TableHeadProps {
    columns: string[];
    columnWidths?: string;
}

export default function TableHead(props: TableHeadProps) {
    return (
        <div
            className="grid items-center bg-neutral-900/50 border border-neutral-800 rounded-t-xl"
            style={{
                "gridTemplateColumns": props.columnWidths ? `calc(26px + 16px) ${props.columnWidths}` : `calc(26px + 16px) ${[...Array(props.columns.length)].map((e, i) => "1fr").join(" ")}`
            } as any}    
        >
            <div className="px-3.5">
                <InputCheckbox
                    inputClassName="!shadow-none"
                />
            </div>
            <>
                {props.columns.map((column, i) => (
                    <div key={i} className="px-2 py-2 border-l border-l-neutral-800">
                        <p className="text-sm font-medium tracking-tight-">
                            {column}
                        </p>
                    </div>
                ))}
            </>
        </div>
    )
}