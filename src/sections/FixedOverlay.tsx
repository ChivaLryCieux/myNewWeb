import { fixedOverlayContent } from '../content/siteContent';

const FixedOverlay = () => (
    <>
        <div className="fixed-overlay top-right">{fixedOverlayContent.topRight}</div>
        <div className="fixed-overlay bottom-left">
            {fixedOverlayContent.bottomLeft.split('\n')[0]}
            <br />
            {fixedOverlayContent.bottomLeft.split('\n')[1]}
        </div>
        <div className="fixed-overlay bottom-right">{fixedOverlayContent.bottomRight}</div>
    </>
);

export default FixedOverlay;
