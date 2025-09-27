import React, { useState, useRef, useEffect } from 'react';
import Shuffle from './components/Shuffle';
import PixelTransition from './components/PixelTransition';

// 导入样式
import './index.css';
import avatarImg from './assets/neoAvater.png';
import bushnellImg from './assets/bushnell.jpg';
import symbolImg from './assets/symbol.jpg';
import hanggaoImg from './assets/hanggao.jpg';
import p1Img from './assets/p1.png';
import p2Img from './assets/p2.png';
import p3Img from './assets/p3.png';
import p4Img from './assets/p4.png';
import p5Img from './assets/p5.png';

// 诗歌数据
interface Poem {
    id: string;
    title: string;
    content: string;
    date?: string;
    note?: string;
    type: 'ancient' | 'modern';
}

const poems: Poem[] = [
    {
        id: '1',
        title: '如梦令·清篆',
        content: `信念横充心岸，璧日临吾袖缎。
取墨掌纹间，刻下雄深清篆。
风颤，风颤，
影曳花飘云散。`,
        date: '2018.6',
        type: 'ancient'
    },
    {
        id: '2',
        title: '水调歌头·既竟中考与同窗别',
        content: `夜半三更起，寰月更加清。小楼幽悄铃铎，惊醒若闻鹰。
掀走一衾慵倦，光暖如焚烈火，室里六灯明。案上群书放，提笔为功名。

三年逝，七月别，意难平。铭心常梦，梦碎夜起瞰昏庭。
当定来年时日，又约街旁肆宇，举酒至宵冥。再话少年事，寰月悄无声。`,
        date: '2020.12.18',
        type: 'ancient'
    },
    {
        id: '3',
        title: '述怀',
        content: `南风开璧日，云乱坐凭栏。
玄豹黯章采，青萍落袖冠。
餐英初识味，造物复归寒。
万里何须北？神州天地宽。`,
        date: '2024.1.16',
        note: '发表于《中华辞赋》2024年第十期',
        type: 'ancient'
    },
    {
        id: '4',
        title: '指针的错误使用',
        content: `不要企图锚定一场风暴，
灌满雨水的神经突触只愿意
小住暂留。尤其当昨夜的
代码固结成岩——你出土的，
只有挂满昙花的错误。

南非的人道主义或是
西班牙传统冷汤，很遗憾，
能指只能无能地指向能指。
所幸演化没有完全褫夺
可怜官能的所有孳息。

若那种病症最终非法，
若那场危机最终爆发，
请调用装在诗句里的诗评：
Error: 'I' has no attribute 'Name'.`,
        date: '2025.6.3',
        note: '同济大学"新诗导读与创作"课程作业',
        type: 'modern'
    }
];

// 设计作品数据
const designWorks = [
    {
        image: bushnellImg,
        alt: 'Bushnell纪念设计',
        caption: ['纪念Bushnell', '2024早春'],
        hoverText: '"美国，你会愤怒还是恐惧"',
        pixelColor: '#00ffff',
        gridSize: 8
    },
    {
        image: symbolImg,
        alt: '设计四秩序',
        caption: ['设计四秩序：符号', '2024春'],
        hoverText: '"符号，能指，与心"',
        pixelColor: '#FFD700',
        gridSize: 9
    },
    {
        image: hanggaoImg,
        alt: '航高设计封面',
        caption: ['为航高设计的资料封面', '2024隆冬'],
        hoverText: '"滋味庞杂"',
        pixelColor: '#ff6b6b',
        gridSize: 7
    },
    {
        image: p1Img,
        alt: '新设计作品一',
        caption: ['新设计作品', '2024'],
        hoverText: '"简洁与功能的平衡"',
        pixelColor: '#4ecdc4',
        gridSize: 8
    },
    {
        image: p2Img,
        alt: '新设计作品二',
        caption: ['新设计作品', '2024'],
        hoverText: '"触手可及的美学"',
        pixelColor: '#9b59b6',
        gridSize: 9
    },
    {
        image: p3Img,
        alt: '新设计作品三',
        caption: ['新设计作品', '2024'],
        hoverText: '"数字时代的视觉语言"',
        pixelColor: '#e74c3c',
        gridSize: 7
    },
    {
        image: p4Img,
        alt: '新设计作品四',
        caption: ['新设计作品', '2024'],
        hoverText: '"用户体验的艺术"',
        pixelColor: '#f39c12',
        gridSize: 8
    },
    {
        image: p5Img,
        alt: '新设计作品五',
        caption: ['新设计作品', '2024'],
        hoverText: '"品牌故事的视觉呈现"',
        pixelColor: '#1abc9c',
        gridSize: 9
    }
];

// 首页组件
const HomePage = () => {
    const [isLoaded, setIsLoaded] = useState(true); // 默认设置为true，确保文字立即显示
    const wrapperRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 确保组件加载后立即设置为loaded状态
        setIsLoaded(true);
    }, []);

    return (
        <div className={`home-main-wrapper ${isLoaded ? 'loaded' : ''}`} ref={wrapperRef}>
            <div className="home-content-new" ref={contentRef}>
                {/* 左侧英文区域 */}
                <div className="home-left-text">
                    <div className="text-line animate-line-1">HELLO</div>
                    <div className="text-line animate-line-2">THIS IS</div>
                    <div className="text-line animate-line-3 highlight-text">
                        <Shuffle 
                            text="TEMPSYCHE"
                            className="shuffle-text-en"
                            tag="span"
                            duration={0.6}
                            shuffleTimes={1}
                            animationMode="evenodd"
                            maxDelay={0.1}
                            stagger={0.03}
                            threshold={0}
                            rootMargin="0px"
                            ease="power2.out"
                            triggerOnHover={true}
                            triggerOnce={false}
                            respectReducedMotion={false}
                        />
                    </div>
                    <div className="text-line animate-line-4">TONGJI UNIVERSITY</div>
                    <div className="text-line animate-line-5">DUAL BACHELOR'S DEGREE PROGRAM IN</div>
                    <div className="text-line animate-line-6">VISUAL COMMUNICATION DESIGN AND ARTIFICIAL INTELLIGENCE</div>
                </div>

                {/* 中心头像区域 */}
                <div className="home-center-avatar">
                    <img src={avatarImg} alt="兹暂客头像" className="avatar-image" />
                </div>

                {/* 右侧中文区域 */}
                <div className="home-right-text">
                    <div className="text-line animate-line-1">你好</div>
                    <div className="text-line animate-line-2">我是</div>
                    <div className="text-line animate-line-3 highlight-text">
                        <Shuffle 
                            text="兹暂客"
                            className="shuffle-text-cn"
                            tag="span"
                            duration={0.6}
                            shuffleTimes={1}
                            animationMode="evenodd"
                            maxDelay={0.1}
                            stagger={0.03}
                            threshold={0}
                            rootMargin="0px"
                            ease="power2.out"
                            triggerOnHover={true}
                            triggerOnce={false}
                            respectReducedMotion={false}
                        />
                    </div>
                    <div className="text-line animate-line-4">同济大学</div>
                    <div className="text-line animate-line-5">视觉传达设计与人工智能</div>
                    <div className="text-line animate-line-6">双学士学位在读</div>
                </div>
            </div>
            
            {/* 滚动提示 */}
            <div className="home-hint-text">
                滚动鼠标滚轮浏览内容
            </div>
        </div>
    );
};

// 诗歌页面组件
const PoetryPage = () => {
    return (
        <div className="poetry-page">
            <div className="poetry-header">
                <h1 className="poetry-title">我的没什么用的诗</h1>
                <p className="poetry-subtitle">我既在这，亦不在这</p>
            </div>

            <div className="poems-container">
                {poems.map((poem) => (
                    <div key={poem.id} className={`poem-card ${poem.type}`}>
                        <div className="poem-header">
                            <h2 className="poem-title">{poem.title}</h2>
                            {poem.date && (
                                <span className="poem-date">{poem.date}</span>
                            )}
                        </div>
                        
                        <div className="poem-content">
                            {poem.content.split('\n').map((line, index) => (
                                <div key={index} className={`poem-line ${line.trim() === '' ? 'empty-line' : ''}`}>
                                    {line || '\u00A0'}
                                </div>
                            ))}
                        </div>
                        
                        {poem.note && (
                            <div className="poem-note">
                                <em>{poem.note}</em>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="poetry-footer">
                {/* 移除返回按钮，保持简洁的设计 */}
            </div>
        </div>
    );
};

// 设计页面组件
const DesignPage = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // 横向滚动事件处理
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        // 处理滚轮事件，实现粘性横向滚动
        const handleWheel = (e: WheelEvent) => {
            // 获取设计区域的位置信息
            const rect = scrollContainer.getBoundingClientRect();
            
            // 判断是否在设计区域的可视范围内
            const isInViewport = (
                rect.top < window.innerHeight && 
                rect.bottom > 0
            );
            
            // 如果不在可视区域，不处理
            if (!isInViewport) {
                return;
            }

            // 获取当前横向滚动位置
            const scrollLeft = scrollContainer.scrollLeft;
            const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            
            // 进一步增加滚动倍率，让滚动更快
            const scrollMultiplier = 3.5; // 原来的3.5倍速度
            const scrollAmount = Math.abs(e.deltaY) * scrollMultiplier;
            
            // 判断滚动方向
            const isScrollingDown = e.deltaY > 0;
            const isScrollingUp = e.deltaY < 0;
            
            // 实现粘性横向滚动逻辑
            if (isScrollingDown) {
                // 向下滚动时，始终进行横向滚动直到最右边
                if (scrollLeft < maxScrollLeft) {
                    e.preventDefault();
                    scrollContainer.scrollLeft += scrollAmount;
                }
            } else if (isScrollingUp) {
                // 向上滚动时，只有在最左边才能竖直滚动
                if (scrollLeft > 0) {
                    e.preventDefault();
                    scrollContainer.scrollLeft -= scrollAmount;
                }
            }
        };

        // 添加事件监听
        window.addEventListener('wheel', handleWheel, { passive: false });
        
        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return (
        <div className="design-page-container">
            <h1 className="design-page-title">设计展示</h1>

            <div className="design-horizontal-scroll-wrapper">
                <div 
                    ref={scrollContainerRef}
                    className="design-gallery-horizontal"
                >
                    {designWorks.map((work, index) => (
                        <div key={index} className="design-gallery-item-horizontal">
                            <PixelTransition
                                firstContent={
                                    <div className="design-image-container">
                                        <img
                                            src={work.image}
                                            alt={work.alt}
                                            className="design-gallery-image"
                                            style={{ 
                                                width: '100%', 
                                                height: '100%', 
                                                objectFit: 'contain',
                                                objectPosition: 'center'
                                            }}
                                        />
                                    </div>
                                }
                                secondContent={
                                    <div className="design-hover-content">
                                        <div className="design-hover-text">
                                            {work.hoverText}
                                        </div>
                                    </div>
                                }
                                gridSize={work.gridSize}
                                pixelColor={work.pixelColor}
                                animationStepDuration={0.4}
                                aspectRatio="100%"
                                style={{ 
                                    width: '100%', 
                                    height: '100%',
                                    border: '2px solid var(--border-color-hud)',
                                    borderRadius: '15px',
                                    overflow: 'hidden'
                                }}
                            />
                            <p className="design-gallery-caption">
                                {work.caption.map((line, lineIndex) => (
                                    <React.Fragment key={lineIndex}>
                                        {line}<br />
                                    </React.Fragment>
                                ))}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* 横向滚动提示 */}
            <div className="scroll-hint">
                <span>← 滚动鼠标滚轮浏览作品 →</span>
            </div>
        </div>
    );
};

// 过渡条组件
const TransitionBar = () => {
    return (
        <section className="scroll-section transition-section">
            <div className="transition-content">
                <div className="scrolling-text">
                    <span>TO LEARN AND CREATE, FOR A MEANINGFUL LIFE AND A BETTER WORLD</span>
                </div>
            </div>
        </section>
    );
};

function App() {
    return (
        <>
            {/* 固定在左上角的标识 Brand */}
            <div className="brand">
                <div>Tempsyche</div>
                <div>兹暂客</div>
            </div>

            {/* 单页连续滚动容器 */}
            <div className="continuous-scroll-container">
                {/* 首页 */}
                <section className="scroll-section home-section">
                    <HomePage />
                </section>

                {/* 过渡条 */}
                <TransitionBar />

                {/* 诗歌页面 */}
                <section className="scroll-section poetry-section">
                    <PoetryPage />
                </section>

                {/* 设计页面 */}
                <section className="scroll-section design-section">
                    <DesignPage />
                </section>
            </div>
        </>
    );
}

export default App;
