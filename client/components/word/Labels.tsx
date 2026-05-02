import clsx from "clsx";

export default function Labels(props: {labels: string[]}) {
    return (
        <>
            {props.labels.map((label, i) => (
                <span
                    key={i}
                    className={clsx(
                        "ml-0.5 px-1.5 py-0.5",
                        "text-xs text-zinc-500 tracking-wide font-medium",
                        "bg-zinc-700 rounded-md"
                    )}
                >
                    {label}
                </span>
            ))}
        </>
    )
}