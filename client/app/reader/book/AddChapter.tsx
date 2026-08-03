import InputButton from "@/components/input/InputButton";
import InputText from "@/components/input/InputText";
import Modal from "@/components/Modal";

interface AddChapterProps {
    onClose: () => void;
}

export default function AddChapter(props: AddChapterProps) {
    return (
        <div className="absolute top-0 left-0 z-200 w-full h-screen flex justify-center items-center">
            <Modal
                title="Add Chapter"
                onClose={() => 1}
            >
                <div className="px-8 py-4 pb-8 flex flex-col gap-y-6">
                    <InputText
                        label="Name"
                    />
                    <InputText
                        label="Number"
                    />
                    <InputButton
                        label="Add Chapter"
                    />
                </div>
            </Modal>
        </div>
    )
}