import InputCheckbox from "@/components/input/InputCheckbox/InputCheckbox";
import clsx from "clsx";
import { Fragment, ReactNode } from "react";


interface TableBodyProps<ObjectType extends {[k: string]: any}> {
    objects: ObjectType[];
    objectID: keyof ObjectType;
    keys: (string)[];
    getElementCallback?: (key: string, object: ObjectType) => ReactNode;
    onClickObjectRow?: (object: ObjectType) => void;
    selectedObjects: Set<any>;
    onSelectObject: (objectID: number) => void;
    onDeselectObject: (objectID: number) => void;
}


export default function TableBody<ObjectType extends {[k: string]: any}>(props: TableBodyProps<ObjectType>) {
    const onClickObjectRow = (object: ObjectType) => {
        if (!props.onClickObjectRow)
            return;
        props.onClickObjectRow(object)
    }


    return (
        <>
            {props.objects.length === 0 &&
                <>
                    {[...Array(1)].map((e, i) => (
                        <div
                            key={i}
                            className="h-10 flex items-center justify-center border-b border-neutral-800"
                        />
                    ))}
                    {[...Array(props.keys.length)].map((e, i) => (
                        <div
                            key={i}
                            className="h-10 flex items-center justify-center border-l border-b border-neutral-800"
                        />
                    ))}
                    {[...Array(1)].map((e, i) => (
                        <div
                            key={i}
                            className="h-10 flex items-center justify-center border-b border-neutral-800"
                        />
                    ))}
                    {[...Array(props.keys.length)].map((e, i) => (
                        <div
                            key={i}
                            className="h-10 flex items-center justify-center border-l border-b border-neutral-800"
                        />
                    ))}
                    {[...Array(1)].map((e, i) => (
                        <div
                            key={i}
                            className="h-10 flex items-center justify-center border-b border-neutral-800"
                        />
                    ))}
                    {[...Array(props.keys.length)].map((e, i) => (
                        <div
                            key={i}
                            className="h-10 flex items-center justify-center border-l border-b border-neutral-800"
                        />
                    ))}
                </>
            }
            {props.objects.map((object, i) => (
                <Fragment 
                    key={i}
                >
                    <div
                        onClick={() => onClickObjectRow(object)} 
                        className="h-full flex items-center justify-center border-b border-neutral-800"
                    >
                        <InputCheckbox
                            inputClassName="!shadow-none"
                            checked={props.selectedObjects.has(object[props.objectID])}
                            onChange={(checked: boolean) => {
                                if (checked) {
                                    props.onSelectObject(object[props.objectID]);
                                }
                                else {
                                    props.onDeselectObject(object[props.objectID]);
                                }
                            }}
                        />
                    </div>
                    {props.keys.map((key) => (
                        <div
                            key={key}
                            onClick={() => onClickObjectRow(object)}
                            className={clsx(
                                "min-w-0 h-full p-2 flex items-center gap-x-2 overflow-clip",
                                "border-l border-b border-neutral-800"
                            )}
                        >
                            {/* Default */}
                            {(key in object) &&
                                <p className="text-sm text-neutral-400 tracking-wide overflow-hidden text-ellipsis">
                                    {String(object[key])}
                                </p>
                            }
                            {/* Custom */}
                            {(!(key in object) && props.getElementCallback) &&
                                <>
                                    {props.getElementCallback(key, object)}
                                </>
                            }    
                        </div>
                    ))}
                </Fragment>
            ))}
        </>
    )
}