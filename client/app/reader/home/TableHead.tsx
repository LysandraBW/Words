import InputCheckbox from "@/components/input/InputCheckbox/InputCheckbox";

interface TableHeadProps {
    columns: string[];
}

export default function TableHead(props: TableHeadProps) {
    return (
        <div className="mx-2 grid grid-cols-[calc(26px+16px)_1fr_1fr_1fr] items-center bg-neutral-900/50 border border-t-0 border-neutral-800">
            <div className="px-3.5">
                <InputCheckbox
                    inputClassName="!shadow-none"
                />
            </div>
            <>
                {props.columns.map((column, i) => (
                    <div key={i} className="px-2 py-2 border-l border-l-neutral-800">
                        <p className="text-xs font-medium tracking-wide">
                            {column}
                        </p>
                    </div>
                ))}
            </>
        </div>
    )
}