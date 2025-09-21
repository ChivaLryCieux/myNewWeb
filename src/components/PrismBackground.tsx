import React from 'react';
import Prism from './Prism';

type PrismBackgroundProps = {
    style?: 'cosmic' | 'cyberpunk' | 'aurora' | 'minimal';
    intensity?: 'low' | 'medium' | 'high';
};

const PrismBackground: React.FC<PrismBackgroundProps> = ({ 
    style = 'cosmic', 
    intensity = 'medium' 
}) => {
    // 预设配置
    const configs = {
        cosmic: {
            low: { glow: 0.8, scale: 3, hueShift: 0.3, colorFrequency: 0.8, timeScale: 0.2, bloom: 0.8 },
            medium: { glow: 1.5, scale: 2.5, hueShift: 0.5, colorFrequency: 1.2, timeScale: 0.3, bloom: 1.2 },
            high: { glow: 2.2, scale: 2, hueShift: 0.8, colorFrequency: 1.8, timeScale: 0.5, bloom: 1.8 }
        },
        cyberpunk: {
            low: { glow: 1.2, scale: 3.2, hueShift: 1.8, colorFrequency: 1.5, timeScale: 0.4, bloom: 1.0 },
            medium: { glow: 1.8, scale: 2.8, hueShift: 2.1, colorFrequency: 2.0, timeScale: 0.6, bloom: 1.5 },
            high: { glow: 2.5, scale: 2.3, hueShift: 2.5, colorFrequency: 2.8, timeScale: 0.8, bloom: 2.2 }
        },
        aurora: {
            low: { glow: 1.0, scale: 3.5, hueShift: 0.1, colorFrequency: 0.6, timeScale: 0.15, bloom: 0.9 },
            medium: { glow: 1.4, scale: 3.0, hueShift: 0.2, colorFrequency: 0.9, timeScale: 0.25, bloom: 1.3 },
            high: { glow: 2.0, scale: 2.5, hueShift: 0.4, colorFrequency: 1.3, timeScale: 0.4, bloom: 1.8 }
        },
        minimal: {
            low: { glow: 0.6, scale: 4, hueShift: 0, colorFrequency: 0.5, timeScale: 0.1, bloom: 0.6 },
            medium: { glow: 0.9, scale: 3.5, hueShift: 0, colorFrequency: 0.8, timeScale: 0.2, bloom: 0.9 },
            high: { glow: 1.3, scale: 3, hueShift: 0.1, colorFrequency: 1.1, timeScale: 0.3, bloom: 1.2 }
        }
    };

    const config = configs[style][intensity];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -3,
            opacity: 0.9  // 提高透明度，让效果更明显
        }}>
            <Prism
                animationType="3drotate"
                height={4.5}
                baseWidth={6.5}
                glow={config.glow}
                scale={config.scale}
                hueShift={config.hueShift}
                colorFrequency={config.colorFrequency}
                timeScale={config.timeScale}
                bloom={config.bloom}
                transparent={true}
                suspendWhenOffscreen={false}
                noise={0.1}
            />
        </div>
    );
};

export default PrismBackground;