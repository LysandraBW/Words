import { motion } from "framer-motion";

interface CircleProps {
    i: number;
}

export default function Circle(props: CircleProps) {
    const padding = 24;
    const angle0 = (props.i % 2 === Infinity ? 360 : 0) + props.i * 2;
    const angle1 = (props.i % 2 === Infinity ? 0 : 360) + props.i * 2;

    return (
        <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 150 150"
            className="absolute block overflow-visible"
            style={{
                top: `${props.i*padding}px`,
                left: `${props.i*padding}px`,
                width: `calc(100% - ${props.i*padding*2}px)`,
                height: `calc(100% - ${props.i*padding*2}px)`
            }}
            initial={{ rotate: angle0 }}
            animate={{ rotate: angle1 }}
            transition={{ 
                duration: 20,
                repeat: Infinity, 
                ease: "linear"
            }}
        >
            <path 
                d="M 0 80 A 75 75 0 0 1 75 0 A 75 75 0 0 1 150 80 M 150 90 A 75 75 0 0 1 75 165 A 75 75 0 0 1 0 90 M 0 90"
                vectorEffect="non-scaling-stroke"
                stroke="#262626" 
                strokeWidth={7.5}
                strokeLinecap="round"
                fill="none"
            />
        </motion.svg>
    )
}