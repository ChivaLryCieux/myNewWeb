import ScrollStack, { ScrollStackItem } from '../components/ScrollStack/ScrollStack';
import { stackCardContent } from '../content/siteContent';

const ScrollStackSection = () => (
    <div className="scroll-stack-section" style={{ backgroundColor: '#18350e' }}>
        <ScrollStack useWindowScroll itemDistance={120} itemScale={0.03} itemStackDistance={30} blurAmount={2}>
            {stackCardContent.map((item) => (
                <ScrollStackItem key={item.text} itemClassName={item.className}>
                    <h2 className="stack-card-text">{item.text}</h2>
                </ScrollStackItem>
            ))}
        </ScrollStack>
    </div>
);

export default ScrollStackSection;
