interface LogoProps {
    spanClassName?: string;
}

export default function Logo(props: LogoProps) {
    return (
        <a 
            href="/"
            className="w-fit h-fit flex items-center gap-1"
        >
            <div className="w-2 h-2 bg-white"/>
            <div className="w-6 h-2 bg-white"/>
            <div className="w-2 h-2 bg-white"/>
        </a>
    )
}