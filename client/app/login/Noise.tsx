export default function Noise() {
    return (
        <div className="w-full h-full absolute">
            <svg 
                className="w-full h-full inset-0 pointer-events-none"
            >
                <defs>
                    <pattern
                        id="dotPattern"
                        width="6"
                        height="6"
                        patternUnits="userSpaceOnUse"
                    >
                        <path d="M6 0 L6 6" stroke="rgb(221, 221, 221)" />
                        <path d="M0 6 L6 6" stroke="rgb(221, 221, 221)" />
                    </pattern>
                    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="100%" stopColor="white" />
                        <stop offset="100%" stopColor="black" />
                    </linearGradient>
                    <mask id="dotMask">
                        <rect width="100%" height="100%" fill="url(#fade)" />
                    </mask>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill="url(#dotPattern)"
                    mask="url(#dotMask)"
                />
            </svg>
        </div>
    );
}