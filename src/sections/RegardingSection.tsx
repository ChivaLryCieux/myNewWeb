import type { MouseEventHandler } from 'react';
import type { RegardingSectionContent } from '../content/siteContent';

interface RegardingSectionProps {
    section: RegardingSectionContent;
    shifted: boolean;
    onMouseMove: MouseEventHandler<HTMLDivElement>;
}

const RegardingSection = ({ section, shifted, onMouseMove }: RegardingSectionProps) => (
    <div
        className={`regarding-container ${section.reverse ? 'reverse' : ''}`.trim()}
        id={section.id}
        onMouseMove={onMouseMove}
    >
        <div
            className={`regarding-background ${shifted ? 'shifted' : ''}`}
            style={{
                backgroundImage: `url(${section.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        />
        <div className="regarding-text">
            <div className="text-wrapper">
                <h1>{section.englishTitle}</h1>
                <p>{section.englishBody}</p>
            </div>
        </div>
        <div className={`regarding-chinese ${shifted ? 'visible' : ''}`}>
            <div className="text-wrapper">
                <h1>{section.chineseTitle}</h1>
                <p>{section.chineseBody}</p>
            </div>
        </div>
    </div>
);

export default RegardingSection;
