interface CurveProps {
    className: string;
    pathClassName: string;
}


export default function Curve(props: Partial<CurveProps>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" className={props.className}>
            <path d="M 0 10 L 10 10 L 10 0 A 10 10 10 0 1 0 10" className={props.pathClassName}/>
        </svg>
    )
}