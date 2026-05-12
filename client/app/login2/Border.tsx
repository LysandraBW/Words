interface BorderProps {
    className: string;
    pathClassName: string;
}


export default function Border(props: Partial<BorderProps>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" preserveAspectRatio="none" className={props.className}>
            <path
                d="M 0 16 V 16 Q 0 18 1.5 18 T 3 16 L 3 16 Q 3 3 16 3 L 16 3 Q 18 3 18 1.5 T 16 0 L 16 0 Q 0 0 0 16 Z"
                className={props.pathClassName}
            />
        </svg>
    )
}

