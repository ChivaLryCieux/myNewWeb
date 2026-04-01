import SplitText from '../components/SplitText';
import { typographyBackgroundLines, typographyForegroundLines } from '../content/siteContent';

const backgroundAnimationProps = {
    className: 'line',
    tag: 'span' as const,
    splitType: 'chars' as const,
    delay: 30,
    duration: 0.8,
    ease: 'power3.out',
    from: { opacity: 0, y: 80 },
    to: { opacity: 1, y: 0 },
    threshold: 0.2,
    rootMargin: '-50px',
    textAlign: 'center' as const,
};

const foregroundAnimationProps = {
    className: 'line',
    tag: 'span' as const,
    splitType: 'chars' as const,
    delay: 40,
    duration: 1.0,
    ease: 'power2.out',
    from: { opacity: 0, y: 30, rotateX: -90 },
    to: { opacity: 1, y: 0, rotateX: 0 },
    threshold: 0.2,
    rootMargin: '-50px',
    textAlign: 'center' as const,
};

const TypographyOverlaySection = () => (
    <div className="typography-overlay">
        <div className="typography-overlay-bg">
            {typographyBackgroundLines.map((line) => (
                <SplitText key={line} text={line} {...backgroundAnimationProps} />
            ))}
        </div>
        <div className="typography-overlay-fg">
            {typographyForegroundLines.map((line) => (
                <SplitText key={line} text={line} {...foregroundAnimationProps} />
            ))}
        </div>
    </div>
);

export default TypographyOverlaySection;
