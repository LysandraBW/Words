export default function Labels(props: {labels: string[]}) {
    return (
        <div className="flex gap-x-5">
            {props.labels.map((label, i) => (
                <span
                    key={i}
                    className="p-1 text-white bg-blue-500"
                >
                    {label}
                </span>
            ))}
        </div>
    )
}