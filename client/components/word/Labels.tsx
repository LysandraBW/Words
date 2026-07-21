import clsx from "clsx";

export default function Labels(props: {labels: string[]}) {
    return (
        <>
            {props.labels.map((label, i) => (
                <span
                    key={i}
                    className={clsx(
                        "mr-1 px-1.5 py-0.5 pb-1",
                        "text-xs text-neutral-400 tracking-wide font-medium",
                        "bg-neutral-800 border border-neutral-700 rounded-md shadow-md"
                    )}
                >
                    {label}
                </span>
            ))}
        </>
    )
}