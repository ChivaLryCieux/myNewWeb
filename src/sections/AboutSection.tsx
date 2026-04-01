import { aboutContent } from '../content/siteContent';

const AboutSection = () => (
    <div className="content" id="about-me">
        <h1>{aboutContent.title}</h1>
        <div className="avatar-container">
            <img src={aboutContent.image} alt={aboutContent.imageAlt} className="avatar-image" />
        </div>
        <p>{aboutContent.text}</p>
    </div>
);

export default AboutSection;
