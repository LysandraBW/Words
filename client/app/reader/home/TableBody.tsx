import InputCheckbox from "@/components/input/InputCheckbox/InputCheckbox";
import { ReactNode } from "react";

interface TableBodyProps<ObjectType extends {[k: string]: any}> {
    objects: ObjectType[];
    objectID: keyof ObjectType;
    keys: (string)[];
    getElementCallback?: (key: string, object: ObjectType) => ReactNode;
    onClickObjectRow: (object: ObjectType) => void;
}

export default function TableBody<ObjectType extends {[k: string]: any}>(props: TableBodyProps<ObjectType>) {
    return (
        <>
            {props.objects.map((object, i) => (
                <div 
                    key={object[props.objectID]}
                    className="grid items-center bg-neutral-900/90 border-x border-b border-neutral-800 hover:bg-neutral-900/0"
                    style={{
                        "gridTemplateColumns": `calc(26px + 16px) ${[...Array(props.keys.length)].map((e, i) => "1fr").join(" ")}`
                    } as any}
                    onClick={() => props.onClickObjectRow(object)}
                >
                    <div className="h-full flex items-center justify-center">
                        <InputCheckbox
                            inputClassName="!shadow-none"
                        />
                    </div>
                    {props.keys.map((key, i) => (
                        <div
                            key={key} 
                            className="h-full p-2 flex items-center gap-x-2 border-l border-neutral-800"
                        >
                            {(key in object) &&
                                <p className="text-xs tracking-wide">{String(object[key])}</p>
                            }
                            {(!(key in object) && props.getElementCallback) &&
                                <>
                                    {props.getElementCallback(key, object)}
                                </>
                            }    
                        </div>
                    ))}
                </div>
            ))}
        </>
    )
}