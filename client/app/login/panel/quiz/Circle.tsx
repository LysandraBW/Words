import { motion } from "framer-motion";

interface CircleProps {
    i: number;
    size: number;
}

export default function Circle(props: CircleProps) {
    const angle0 = (props.i % 2 === 0 ? 0 : 450);
    const angle1 = (props.i % 2 === 0 ? 360 : 90);

    return (
        <motion.path 
            // d="M 0 80 A 75 75 0 0 1 75 0 A 75 75 0 0 1 150 80 M 150 90 A 75 75 0 0 1 75 165 A 75 75 0 0 1 0 90 M 0 90"
            // d="M 0 75 A 75 75 0 0 1 75 0 M 150 75 A 75 75 0 0 1 75 150"
            // d="M 0 75 A 75 75 0 0 1 75 0 M 150 75 A 75 75 0 0 1 75 150 A 75 75 0 0 1 0 75"
            // d="M 0 70 A 75 75 0 0 1 75 0 M 150 80 A 75 75 0 0 1 75 150 A 75 75 0 0 1 0 80 M 75 0 A 75 75 0 0 1 150 70"
            // d="M 0 70 A 75 75 0 0 1 70 0 M 150 80 A 75 75 0 0 1 80 150 M 70 150 A 75 75 0 0 1 0 80 M 80 0 A 75 75 0 0 1 150 70"
            d="M 0 75 A 75 75 0 0 1 75 0 M 150 75 A 75 75 0 0 1 75 150 M 75 150 A 75 75 0 0 1 0 75 M 75 0 A 75 75 0 0 1 150 75"
            vectorEffect="non-scaling-stroke"
            stroke="white" 
            strokeWidth={10}
            strokeLinecap="round"
            fill="none"
            style={{
                transformBox: "fill-box",
                transformOrigin: "center",
            }}
            // initial={{ rotate: angle0, scale: 1 - (props.i + 1)/props.size }}
            // animate={{ rotate: angle1, scale: 1 - (props.i + 1)/props.size }}
            // transition={{ 
            //     duration: 10,
            //     repeat: Infinity, 
            //     ease: "linear"
            // }}
            transform={`scale(${1 - (props.i)/props.size})`}
        />
    )
}