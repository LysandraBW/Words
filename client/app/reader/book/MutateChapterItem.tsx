import InputText from "@/components/input/InputText";
import { Form, testForm, updateFormValue } from "@/utilities/form";
import clsx from "clsx";
import { GripVerticalIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { isSortable, useSortable } from '@dnd-kit/react/sortable';
import InputError from "@/components/input/InputError";


interface MutateChapterInListProps {
    formID: string;
    form: Form<any>;
    setForm: (form: Form<any>) => void;
    setChapterForms?: any;
    updateChapterForm?: any; // ALLOW, I'm being lazy
    onCreate?: () => void;
    onDelete?: () => void;
    isUpdate?: boolean;
    isCreate?: boolean;
    isSortable?: boolean;
    sortableIndex?: number;
}

export default function MutateChapterInList(props: MutateChapterInListProps) {
    const { ref, isDragging, } = useSortable({ 
        id: props.formID, 
        index: props.sortableIndex || 0
    });

    return (
        <div
            ref={props.isSortable ? ref : null}
        >
            <div
                className="grid grid-rows-1 grid-cols-[40px_1fr_40px] items-end gap-x-2"
            >
                {/* <InputText
                    label="Index"
                    value={props.form.chapter_number.value}
                    error={props.form.chapter_number.error}
                    onChange={(value) => {
                        if (props.isCreate) {
                            props.setForm(updateFormValue(props.form, "chapter_number", value));
                        }
                        else {
                            props.setChapterForms((forms: any) => props.updateChapterForm({
                                forms, 
                                id: props.formID, 
                                form: props.form, 
                                label: "chapter_number", 
                                value
                            }))
                        }
                    }}
                    inputClassName="text-center"
                /> */}
                {props.isSortable ?
                    <div 
                        className={clsx(
                            "w-[40px] aspect-square flex justify-center items-center",
                            "rounded-md bg-neutral-900 border- border-neutral-800 shadow-md",
                            "cursor-pointer text-neutral-400 hover:text-blue-500",
                            isDragging && "!text-blue-500"
                        )}
                    >
                        <GripVerticalIcon
                            size={16}
                            className="text-inherit"
                        />
                    </div>
                    :
                    <div></div>
                }
                <InputText
                    label="Name"
                    value={props.form.chapter_title.value}
                    onChange={(value) => {
                        if (props.isCreate) {
                            props.setForm(updateFormValue(props.form, "chapter_title", value));
                        }
                        else {
                            props.setChapterForms((forms: any) => props.updateChapterForm({
                                forms, 
                                id: props.formID, 
                                form: props.form, 
                                label: "chapter_title", 
                                value
                            }))
                        }
                    }}
                />
                <button 
                    onClick={() => {
                        if (!testForm(props.form))
                            return;
                        if (props.isCreate && props.onCreate)
                            props.onCreate();
                        if (props.isUpdate && props.onDelete)
                            props.onDelete();
                    }}
                    className={clsx(
                        "w-[40px] aspect-square flex justify-center items-center group",
                        "rounded-md bg-neutral-900 border border-neutral-800 shadow-md"
                    )}
                >
                    {props.isCreate &&
                        <PlusIcon
                            size={16}
                            className="text-neutral-500 group-hover:text-blue-500"
                        />
                    }
                    {props.isUpdate &&
                        <Trash2Icon
                            size={16}
                            strokeWidth={1.5}
                            className="text-neutral-500 group-hover:text-red-600"
                        />
                    }
                </button>
            </div>
            <div className="grid grid-rows-1 grid-cols-[40px_1fr_40px] items-end gap-x-2">
                <div className="col-start-2">
                    <InputError
                        error={props.form.chapter_title.error}
                    />
                </div>
            </div>
        </div>
    )
}