import clsx from "clsx";

export default function Noise({color, darkerColor}: {color: string; darkerColor: string}) {
    return (
        <div className="w-full h-full absolute" style={{background: color}}>
            {/* <svg
                className={clsx(
                    "absolute top-[-0.5px] left-[-0.5px] w-full h-full"
                )}
            >
                <defs>
                    <pattern
                        id="blurPattern"
                        width="6"
                        height="6"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M6 0 L0 0 0 6"
                            fill="none"
                            stroke={color}
                            strokeOpacity={0.2}
                            strokeWidth="1"
                            className="invert"
                        />
                    </pattern>
                    <radialGradient id="blurMask">
                        <stop offset="0%" stopColor="white" />
                        <stop offset="55%" stopColor="white" />
                        <stop offset="100%" stopColor="black" />
                    </radialGradient>
                    <mask id="blurFade">
                        <rect
                            width="100%"
                            height="100%"
                            fill="url(#blurMask)"
                        />
                    </mask>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill="url(#blurPattern)"
                    mask="url(#blurFade)"
                />
            </svg> */}
            
            {/* <svg 
                className="w-full h-full inset-0 pointer-events-none"
            >
                <defs>
                    <pattern
                        id="dotPattern"
                        width="6"
                        height="6"
                        patternUnits="userSpaceOnUse"
                    >
                        <path d="M6 0 L6 6" stroke={darkerColor} strokeOpacity={1}/>
                        <path d="M0 6 L6 6" stroke={darkerColor} strokeOpacity={1}/>
                    </pattern>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill="url(#dotPattern)"
                    mask="url(#dotMask)"
                />
            </svg> */}
        </div>
    );
}