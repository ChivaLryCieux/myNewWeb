import type { RefObject } from 'react';
import { heroContent } from '../content/siteContent';

interface HeroRevealSectionProps {
    cubeRef: RefObject<HTMLDivElement | null>;
}

const HeroRevealSection = ({ cubeRef }: HeroRevealSectionProps) => (
    <div className="reveal-container">
        <div className="sticky-wrapper">
            <div className="reveal-layer" id="rubiks-cube-container">
                <div ref={cubeRef} className="rubiks-cube-center" />
            </div>

            <div className="reveal-layer top-layer">
                <div className="first-page-layout">
                    <div className="first-page-text">
                        <h1>{heroContent.title}</h1>
                    </div>
                    <div className="first-page-image">
                        <img src={heroContent.image} alt={heroContent.imageAlt} />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default HeroRevealSection;
