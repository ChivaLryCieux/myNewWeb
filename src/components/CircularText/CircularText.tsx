import React, { useEffect, useRef, useState } from 'react';
import './CircularText.css';

interface CircularTextProps {
    text: string;
    spinDuration?: number;
    /** 圆形容器的直径，单位 px */
    size?: number;
    /** 圆形路径的半径，单位 SVG 坐标 */
    radius?: number;
    /** 文字大小，单位 px */
    fontSize?: number;
    className?: string;
}

const CircularText: React.FC<CircularTextProps> = ({
    text,
    spinDuration = 8,
    size = 80,
    radius = 48,
    fontSize = 32,
    className = '',
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: -200, y: -200 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => {
            setIsVisible(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.documentElement.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isVisible]);

    const characters = Array.from(text);
    const cx = 100, cy = 100;

    return (
        <div
            ref={containerRef}
            className={`circular-text ${className}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.3s ease',
                ['--spin-duration' as string]: `${spinDuration}s`,
                ['--ct-size' as string]: `${size}px`,
                ['--ct-font-size' as string]: `${fontSize}px`,
            }}
        >
            <svg viewBox="0 0 200 200">
                <defs>
                    <path
                        id="circlePath"
                        d={`M ${cx}, ${cy} m -${radius}, 0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
                    />
                </defs>
                <text>
                    <textPath href="#circlePath" startOffset="0%">
                        {characters.map((char, i) => (
                            <tspan key={i}>{char}</tspan>
                        ))}
                    </textPath>
                </text>
            </svg>
        </div>
    );
};

export default CircularText;
