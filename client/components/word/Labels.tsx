export default function Labels(props: {labels: string[]}) {
    return (
        <>
            {props.labels.map((label, i) => (
                <span
                    key={i}
                    className="px-1 py-0.5 text-sm text-zinc-500 font-medium bg-zinc-800 rounded-md"
                >
                    {label}
                </span>
            ))}
        </>
    )
}