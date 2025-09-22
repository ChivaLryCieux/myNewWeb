import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import './SimpleMouseFollowText.css';

interface SimpleMouseFollowTextProps {
    text?: string;
    enabled?: boolean;
    className?: string;
}

const SimpleMouseFollowText: React.FC<SimpleMouseFollowTextProps> = ({
    text = "✨ 探索创意边界 • 追寻灵感轨迹 •",
    enabled = true,
    className = ''
}) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!enabled) {
            setIsVisible(false);
            return;
        }

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ 
                x: e.clientX, 
                y: e.clientY 
            });
            if (!isVisible) {
                setIsVisible(true);
            }
        };

        const handleMouseLeave = () => {
            setIsVisible(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [enabled, isVisible]);

    if (!enabled || !isVisible) return null;

    // 将文字转换为字符数组
    const letters = Array.from(text);
    const radius = 50;

    return (
        <motion.div
            className={`simple-mouse-follow-text ${className}`}
            style={{
                left: mousePosition.x - radius,
                top: mousePosition.y - radius,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
                opacity: isVisible ? 0.8 : 0, 
                scale: isVisible ? 1 : 0.5,
                rotate: isVisible ? 360 : 0
            }}
            transition={{ 
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
                rotate: { duration: 20, ease: "linear", repeat: Infinity }
            }}
        >
            {letters.map((letter, index) => {
                const angle = (360 / letters.length) * index;
                const radian = (angle * Math.PI) / 180;
                const x = Math.cos(radian) * radius;
                const y = Math.sin(radian) * radius;

                return (
                    <span
                        key={index}
                        className="letter"
                        style={{
                            transform: `translate(${x}px, ${y}px) rotate(${angle + 90}deg)`,
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transformOrigin: '0 0',
                        }}
                    >
                        {letter}
                    </span>
                );
            })}
        </motion.div>
    );
};

export default SimpleMouseFollowText;