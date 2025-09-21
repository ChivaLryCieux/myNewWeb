import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import CircularText from './CircularText';
import './MouseFollowText.css';

interface MouseFollowTextProps {
    text: string;
    spinDuration?: number;
    size?: number;
    followSpeed?: number;
    offset?: { x: number; y: number };
    className?: string;
    enabled?: boolean;
}

const MouseFollowText: React.FC<MouseFollowTextProps> = ({
    text = "Follow Your Dreams • Create Your Future • ",
    spinDuration = 15,
    size = 120,
    offset = { x: 0, y: 0 },
    className = '',
    enabled = true
}) => {
    const [isVisible, setIsVisible] = useState(false);
    
    // 使用 useMotionValue 和 useSpring 创建平滑的鼠标跟随效果
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    useEffect(() => {
        if (!enabled) {
            setIsVisible(false);
            return;
        }

        const handleMouseMove = (e: MouseEvent) => {
            // 更新鼠标位置，加上偏移量
            mouseX.set(e.clientX + offset.x);
            mouseY.set(e.clientY + offset.y);
            
            // 显示文字
            if (!isVisible) {
                setIsVisible(true);
            }
        };

        const handleMouseLeave = () => {
            // 当鼠标离开窗口时隐藏文字
            setIsVisible(false);
        };

        // 添加事件监听器
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseleave', handleMouseLeave);

        // 清理函数
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [enabled, mouseX, mouseY, offset.x, offset.y, isVisible]);

    if (!enabled || !isVisible) return null;

    return (
        <motion.div
            className={`mouse-follow-text ${className}`}
            style={{
                x: springX,
                y: springY,
                width: size,
                height: size,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
                opacity: isVisible ? 0.8 : 0, 
                scale: isVisible ? 1 : 0.5 
            }}
            transition={{ 
                opacity: { duration: 0.3 },
                scale: { duration: 0.3, type: 'spring', stiffness: 200 }
            }}
        >
            <CircularText
                text={text}
                spinDuration={spinDuration}
                onHover="speedUp"
                className="mouse-follow-circular-text"
            />
        </motion.div>
    );
};

export default MouseFollowText;