import Button from "@/components/Button";
import InputText from "@/components/input/InputText";
import Panel from "@/components/Panel";

interface CreateChapterProps {
    onClose: () => void;
}

export default function CreateChapter(props: CreateChapterProps) {
    return (
        <Panel
            title="Create Chapter"
            onClose={props.onClose}
        >
            <div className="px-8 py-4 pb-8 flex flex-col gap-y-6">
                <InputText
                    label="Name"
                />
                <InputText
                    label="Number"
                />
                <Button
                    label="Create Chapter"
                    outerClassName="!w-full"
                />
            </div>
        </Panel>
    )
}