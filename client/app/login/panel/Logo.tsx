import { dynaPuffFont } from "@/app/fonts";

export default function Logo() {
    return (
        <svg
            width="100%"
            height="100%"
            className="rounded-bl-4xl backdrop-blur-sm saturate-200"
        >
            <rect width="100%" height="100%" x="0" y="0" fillOpacity={1} mask="url(#knockout-text)" className="fill-neutral-900"/>
            <mask id="knockout-text">
                <rect width="100%" height="100%" fill="#fff" x="0" y="0"/>
                <text 
                    x="50%" 
                    y="45%" 
                    fill="#000" 
                    textAnchor="middle" 
                    dominantBaseline="middle" 
                    letterSpacing={"-3px"} 
                    className={`${dynaPuffFont.className}`} 
                    fontSize={32} 
                    fontWeight={400}
                    style={{ 
                        transformBox: 'fill-box', 
                        transformOrigin: 'center',
                        transform: 'scaleY(1)'
                    }}
                >
                    WORDS
                </text>
            </mask>
        </svg>
    )
}