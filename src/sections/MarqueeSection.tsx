import { marqueeText } from '../content/siteContent';

const MarqueeSection = () => (
    <div className="marquee-container">
        <div className="marquee-track">
            <span>{marqueeText}</span>
            <span>{marqueeText}</span>
        </div>
    </div>
);

export default MarqueeSection;
