import clsx from "clsx";

interface ProfilePictureProps {
    profilePictureURL?: string;
    length?: string;
    profilePictureClassName?: string;
    onClick: () => void;
}

export default function ProfilePicture(props: ProfilePictureProps) {
    return (
        <div 
            id="profile"
            onClick={props.onClick}
            className={clsx(
                "aspect-square h-full bg-center bg-cover",
                "bg-neutral-800 border border-neutral-600 rounded-md shadow-md",
                props.profilePictureClassName
            )}
            style={{
                width: props.length || "auto",
                height: props.length || "auto",
                backgroundImage: `url(${props.profilePictureURL})`
            }}
        />
    )
}