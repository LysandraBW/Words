import { nunito, snigletFont } from "@/app/fonts";
import InputCheckbox from "@/components/input/InputCheckbox/InputCheckbox";
import clsx from "clsx";

interface TableHeadProps {
    columns: string[];
    columnWidths?: string;
}

export default function TableHead(props: TableHeadProps) {
    return (
        <
            // className="grid items-center bg-neutral-900 border border-neutral-800 rounded-t-lg"
            // style={{
            //     "gridTemplateColumns": props.columnWidths ? `calc(26px + 16px) ${props.columnWidths}` : `calc(26px + 16px) ${[...Array(props.columns.length)].map((e, i) => "1fr").join(" ")}`
            // } as any}    
        >
            <div className="px-3.5 flex justify-center items-center bg-neutral-900 border-b border-neutral-800">
                <InputCheckbox
                    inputClassName="!shadow-none"
                />
            </div>
            <>
                {props.columns.map((column, i) => (
                    <div key={i} className="px-2 py-2 flex items-center border-l border-b border-neutral-800">
                        <p 
                            className={clsx(
                                "text-xs font-semibold text-neutral-500 whitespace-nowrap overflow-hidden text-ellipsis",
                                // nunito.className
                            )}
                        >
                            {column}
                        </p>
                    </div>
                ))}
            </>
        </>
    )
}