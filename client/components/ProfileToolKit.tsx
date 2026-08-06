import { ReaderType } from "@/services/server/reader";
import { LogOutIcon } from "lucide-react";
import { Tooltip } from "react-tooltip";


interface ProfileToolKitProps {
    profilePictureURL: string;
    reader: ReaderType;
}


export default function ProfileToolKit(props: ProfileToolKitProps) {
    return (
        <Tooltip
            anchorSelect="#profile"
            clickable
            style={{
                width: "300px",
                borderRadius: "6px",
                padding: 0,
                boxShadow: "0px 2px 2px 0px #00000010",
                zIndex: 200,
                pointerEvents: "auto"
            }}
            className="!p-0 !bg-neutral-800 !opacity-100 border border-neutral-700 rounded-lg !shadow-md"
            float={false}
            positionStrategy="fixed"
            place="bottom"
            openOnClick
        >
            <div className="flex">
                <div 
                    className="w-10 h-10 min-h-10 min-w-10 m-4 mr-0 bg-center bg-cover border border-neutral-600 bg-neutral-800 !rounded-md shadow"
                    style={{
                        backgroundImage: `url(${props.profilePictureURL})`
                    }}
                >
                </div>
                <div className="p-4">
                    <p className="text-sm text-neutral-100 font-medium">
                        {props.reader?.reader_name}
                    </p>
                    <p className="text-sm text-neutral-300 tracking-wide">
                        {props.reader?.reader_email}
                    </p>
                </div>
            </div>
            <div className="p-2 flex justify-end !bg-neutral-900 rounded-b-lg ">
                <button className="px-2 py-0.5 flex items-center gap-x-2 bg-neutral-700 border border-neutral-600 rounded-md shadow-md">
                    <LogOutIcon
                        size={14}
                        className="stroke-neutral-300"
                    />
                    <label className="text-xs text-neutral-200 font-medium">
                        Log Out
                    </label>
                </button>
            </div>
        </Tooltip>
    )
}