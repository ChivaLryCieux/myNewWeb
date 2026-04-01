import { useRef } from 'react';
import CircularText from './components/CircularText/CircularText';
import { regardingSections } from './content/siteContent';
import { useRegardingHover } from './hooks/useRegardingHover';
import { useRubiksCubeReveal } from './hooks/useRubiksCubeReveal';
import AboutSection from './sections/AboutSection';
import FixedOverlay from './sections/FixedOverlay';
import HeroRevealSection from './sections/HeroRevealSection';
import MapSection from './sections/MapSection';
import MarqueeSection from './sections/MarqueeSection';
import RegardingSection from './sections/RegardingSection';
import ScrollStackSection from './sections/ScrollStackSection';
import TypographyOverlaySection from './sections/TypographyOverlaySection';

const App = () => {
    const rubiksCubeRef = useRef<HTMLDivElement>(null);
    const { shiftedMap, handlers } = useRegardingHover(regardingSections.map((section) => section.id));

    useRubiksCubeReveal(rubiksCubeRef);

    return (
        <>
            <CircularText text="CHIVALRY CIEUX ★ " spinDuration={8} />
            <FixedOverlay />
            <HeroRevealSection cubeRef={rubiksCubeRef} />
            <ScrollStackSection />
            <MapSection />
            <TypographyOverlaySection />
            <AboutSection />
            <MarqueeSection />
            {regardingSections.map((section) => (
                <RegardingSection
                    key={section.id}
                    section={section}
                    shifted={shiftedMap[section.id] ?? false}
                    onMouseMove={(event) => handlers[section.id](event, section.reverse)}
                />
            ))}
        </>
    );
};

export default App;
