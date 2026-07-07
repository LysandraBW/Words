import InputCheckbox from "@/components/input/InputCheckbox/InputCheckbox";
import { ReactNode } from "react";

interface TableRowProps<ObjectType extends {[k: string]: any}> {
    objects: ObjectType[];
    objectID: keyof ObjectType;
    keys: string[];
    getElementCallback: (key: string, object: ObjectType) => ReactNode;
}

export default function TableRow<ObjectType extends {[k: string]: any}>(props: TableRowProps<ObjectType>) {
    return (
        <>
            {props.objects.map((object, i) => (
                <div 
                    key={object[props.objectID]}
                    className="grid grid-cols-[calc(26px+16px)_1fr_1fr_1fr] items-center bg-neutral-900/25 border-x border-b border-neutral-800 hover:bg-neutral-900/0"
                >
                    <div className="h-full flex items-center justify-center">
                        <InputCheckbox
                            inputClassName="!shadow-none"
                        />
                    </div>
                    {props.keys.map((key, i) => (
                        <div className="h-full p-2 flex items-center gap-x-2 border-l border-neutral-800">
                            {(key in object) &&
                                <p className="text-xs tracking-wide">{object[key]}</p>
                            }
                            {!(key in object) &&
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