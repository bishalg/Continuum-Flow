
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

export function AnimatedCurrency({ value, prefix = "$", className = "" }: { value: number, prefix?: string, className?: string }) {
    const motionValue = useMotionValue(value);
    const displayValue = useTransform(motionValue, (latest) =>
        latest.toFixed(value % 1 === 0 ? 0 : 2)
    );

    useEffect(() => {
        const controls = animate(motionValue, value, {
            duration: 1, // 1 second scrolling duration
            type: "tween",
            ease: "circOut"
        });
        return controls.stop;
    }, [value, motionValue]);

    return (
        <span className={`inline-flex items-center ${className}`}>
            {prefix}
            <motion.span>{displayValue}</motion.span>
        </span>
    );
}
