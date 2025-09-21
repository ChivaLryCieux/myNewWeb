import React, { useState, useEffect } from 'react';
import styles from './MaogaiPage.module.css';

// 假设图片位于 src/assets/ 目录
import zhibeiImg from '../assets/zhibei.jpg';
import duanxiuImg from '../assets/duanxiu.jpg';
import fanbudaiImg from '../assets/fanbudai.jpg';


export const MaogaiPage: React.FC = () => {
    // State 用于管理“查看更多”详情区域的可见性
    const [detailsVisible, setDetailsVisible] = useState({
        ccp4: false,
        zunyi: false,
    });

    // 用于切换详情可见性的处理函数
    const toggleDetails = (key: keyof typeof detailsVisible) => {
        setDetailsVisible(prevState => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    // 当组件加载时，为 body 添加专属主题类；当组件卸载时，移除该类。
    useEffect(() => {
        document.body.classList.add('maogai-theme');
        return () => {
            document.body.classList.remove('maogai-theme');
        };
    }, []); // 空依赖数组确保只在挂载和卸载时运行

    return (
        <>
            <nav className={styles.mainNav}>
                <div className={styles.container}>
                    <div className={styles.navContent}>
                        <a href="#hero" className={styles.navLink}>引言/</a>
                        <a href="#history" className={styles.navLink}>历史回响/</a>
                        <a href="#youth-survey" className={styles.navLink}>青年之声/</a>
                        <a href="#ai-creation" className={styles.navLink}>智创未来/</a>
                        <a href="#reflections" className={styles.navLink}>启示与展望</a>
                    </div>
                </div>
            </nav>

            {/* Hero Section，为了匹配主题，这里可以创建一个新的hero或者调整样式 */}
            <section id="hero" className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>歌未竟，东方白</h1>
                    <p className={styles.heroSubtitle}>
                        以遵义会议精神为指引的新时代红色文化传播媒介调研与设计
                    </p>
                    <p className={styles.heroText}>
                        在中共四大召开一百周年、遵义会议召开九十周年之际，本应用旨在通过互动方式回顾历史、聚焦青年视角，展示人工智能与文创产品等新媒介在传承红色文化中的创新实践，同时展望未来。
                    </p>
                    <p className={styles.heroText}>
                        2025同济大学毛概课程实践。
                    </p>
                </div>
            </section>

            <main className={styles.container}>
                <section id="history" className={styles.section}>
                    <h2 className={styles.sectionTitle}>历史回响</h2>
                    <div className={styles.sectionIntro}>
                        <p>
                            本部分回顾中共四大与遵义会议这两大里程碑事件。它们不仅塑造了党的早期发展轨迹，其精神内核至今仍指引我们前行。通过这些历史，我们可以更好地理解中国共产党如何探索并最终找到符合中国国情的革命道路。
                        </p>
                    </div>
                    <div className={styles.gridContainer}>
                        <div className={styles.card}>
                            <h3>中国共产党第四次全国代表大会</h3>
                            <p>中共四大（1925年1月）在党的早期发展中具有关键地位。它首次明确提出了无产阶级在民主革命中的领导权问题，并强调了工农联盟的重要性。</p>
                            <ul style={{ listStyleType: 'disc' }}>
                                <li><strong>核心成果：</strong>
                                    <ul style={{ listStyleType: 'circle', paddingLeft: '1rem', fontSize: '0.875rem' }}>
                                        <li>无产阶级领导权：首次明确提出。</li>
                                        <li>工农联盟：强调其极端重要性。</li>
                                        <li>党的建设：加强组织与群众工作。</li>
                                        <li>统一战线：初步思想萌芽。</li>
                                    </ul>
                                </li>
                            </ul>
                            <button onClick={() => toggleDetails('ccp4')} className={styles.detailsToggle}>查看更多 &rarr;</button>
                            <div className={styles.detailsContent} style={{ display: detailsVisible.ccp4 ? 'block' : 'none' }}>
                                <p>中共四大深刻分析了中国社会性质和革命形势，为后续革命斗争指明了方向，对党的理论成熟和组织发展起到了重要推动作用。</p>
                            </div>
                        </div>
                        <div className={styles.card}>
                            <h3>遵义会议精神</h3>
                            <p>遵义会议（1935年1月）是中国共产党历史上一个生死攸关的转折点。会议确立了毛泽东同志在党和红军中的领导地位，挽救了党、红军和中国革命。</p>
                            <ul style={{ listStyleType: 'disc' }}>
                                <li><strong>核心要义：</strong>
                                    <ul style={{ listStyleType: 'circle', paddingLeft: '1rem', fontSize: '0.875rem' }}>
                                        <li>坚持真理，修正错误。</li>
                                        <li>独立自主，实事求是。</li>
                                        <li>团结奋斗，顾全大局。</li>
                                        <li>坚定信念，勇往直前。</li>
                                    </ul>
                                </li>
                            </ul>
                            <button onClick={() => toggleDetails('zunyi')} className={styles.detailsToggle}>查看更多 &rarr;</button>
                            <div className={styles.detailsContent} style={{ display: detailsVisible.zunyi ? 'block' : 'none' }}>
                                <p>遵义会议的精神是中国共产党宝贵的精神财富，体现了党自我革命的勇气和将马克思主义基本原理与中国具体实际相结合的智慧。</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="youth-survey" className={styles.section}>
                    <h2 className={styles.sectionTitle}>青年之声：文创调研</h2>
                    <div className={styles.sectionIntro}>
                        <p>
                            为了解当代青年对党史纪念品形式的偏好，我们进行了线上采访。采访内容见实践报告文档。调研结果显示，青年群体对富有创意且实用的文创产品抱有浓厚兴趣。本部分将展示调研中青年群体关注的主要方面，这些发现为我们如何更好地传承红色文化提供了新的视角。
                        </p>
                    </div>
                    <div className={styles.card}>
                        <h3 style={{ textAlign: 'center', fontSize: '1.25rem' }}>青年对党史文创产品的期待</h3>
                        <div className={styles.keywordTagContainer}>
                            <span className={styles.keywordTag} title="同学们认为纪念品应具备实际使用价值，而非纯观赏。">实用性与设计感兼具</span>
                            <span className={styles.keywordTag} title="融入青年流行文化元素，如国潮、卡通等，更易引起共鸣。">青年文化元素</span>
                            <span className={styles.keywordTag} title="纪念品若能承载党史故事或提供互动体验，将更受欢迎。">故事性与互动性</span>
                            <span className={styles.keywordTag} title="对电子书签、主题壁纸等数字形式的纪念品也表现出兴趣。">数字化纪念品</span>
                            <span className={styles.keywordTag} title="希望产品能巧妙融入日常生活，而非仅作收藏。">融入日常生活</span>
                            <span className={styles.keywordTag} title="期待更多创新形式，打破传统纪念品刻板印象。">创新形式</span>
                        </div>
                        <p style={{ textAlign: 'center', color: 'var(--color-neutral-500)', marginTop: '1.5rem', fontSize: '0.875rem' }}>
                            调研表明，青年一代期望通过更现代、更贴近生活的方式接触和理解党史文化。
                        </p>
                    </div>
                </section>

                <section id="ai-creation" className={styles.section}>
                    <h2 className={styles.sectionTitle}>智创未来：AI实践</h2>
                    <div className={styles.sectionIntro}>
                        <p>
                            本部分展示了运用人工智能大语言模型进行遵义会议纪念诗歌创作的实践尝试。这些探索旨在将红色文化与前沿科技相结合，以新颖的形式吸引青年，并获得了同学们的积极评价，显示了科技赋能文化传承的巨大潜力。
                        </p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-red-700)', marginBottom: '1.5rem', textAlign: 'center' }}>Deepseek辅助创作纪念诗歌：《转折的棱镜》</h3>
                        <div className={styles.poemContainer}>
                            <h4>转折的棱镜</h4>
                            <pre>
{`当所有的指针都开始锈蚀
赤水河在暗夜里收紧血管
泥泞咬住草鞋，预言在弹匣中结霜
只有饥饿的地图，折叠成悬崖

直到一场雪落在遵义的门槛
煤油灯拨亮草图上每一道皱褶
有人拆解锁链的重量，把火种
重新排列：让灰烬学会倒流

从此，暗河有了星辰的走向
篝火在裂痕处锻打新的经纬
而那颗星辰始终悬在最高的桅杆
成为所有黎明破茧时
那道不肯弯曲的光线`}
                            </pre>
                        </div>
                    </div>
                    <div style={{ marginTop: '3rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-red-700)', marginBottom: '2rem', textAlign: 'center' }}>文创产品设计展示</h3>
                        <div className={`${styles.gridContainer} ${styles['grid-container-3-cols']}`}>
                            <div className={styles.productCard}>
                                <img src={zhibeiImg} alt="“毛泽东思想战无不胜”纸杯" className={styles.productImage} />
                                <div className={styles['p-4']}>
                                    <h4>“毛泽东思想战无不胜”纸杯</h4>
                                </div>
                            </div>
                            <div className={styles.productCard}>
                                <img src={duanxiuImg} alt="遵义会议刺绣短袖" className={styles.productImage} />
                                <div className={styles['p-4']}>
                                    <h4>遵义会议刺绣短袖</h4>
                                </div>
                            </div>
                            <div className={styles.productCard}>
                                <img src={fanbudaiImg} alt="遵义会议刺绣帆布包" className={styles.productImage} />
                                <div className={styles['p-4']}>
                                    <h4>遵义会议刺绣帆布包</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="reflections" className={styles.section}>
                    <h2 className={styles.sectionTitle}>启示与展望</h2>
                    <div className={styles.sectionIntro}>
                        <p>
                            此次实践调研，从历史回顾到青年访谈，再到AI创作尝试与文创产品设计，揭示了新时代传承红色文化的多重路径。科技的进步为党史教育提供了前所未有的机遇，使其能够以更生动、更互动的方式触达年轻一代。
                        </p>
                    </div>
                    <div className={styles.card}>
                        <h3 style={{ textAlign: 'center', fontSize: '1.25rem' }}>传承红色基因，拥抱创新未来</h3>
                        <p>通过本次实践，我们深刻认识到：</p>
                        <ul style={{ listStyleType: 'disc', listStylePosition: 'inside', color: 'var(--color-neutral-600)', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li><strong>科技赋能是关键：</strong> 人工智能等技术能为党史教育注入新活力，创造更具吸引力的内容和形式。</li>
                            <li><strong>青年视角很重要：</strong> 了解青年群体的文化偏好和审美趣味，是提升党史教育有效性的前提。</li>
                            <li><strong>互动体验促深化：</strong> 参与式、体验式的学习方式比单向灌输更能激发青年人的学习兴趣和情感共鸣。</li>
                            <li><strong>故事化叙事有力量：</strong> 将宏大历史叙事转化为生动故事，更能打动人心，传递精神价值。</li>
                            <li><strong>价值引领是核心：</strong> 无论形式如何创新，党史教育的根本在于传递核心价值观，坚定理想信念。</li>
                        </ul>
                        <p style={{ marginTop: '1rem' }}>
                            展望未来，我们应继续探索科技与人文的深度融合，开发更多富有创意、贴近生活的党史教育产品和服务，让红色基因在新时代焕发璀璨光芒，激励一代又一代青年为实现中华民族伟大复兴的中国梦而努力奋斗。
                        </p>
                    </div>
                </section>
            </main>

            <footer className={styles.mainFooter}>
                <p>&copy; 实践报告互动展示，基于实践报告内容创作。2025同济大学毛概课程实践。</p>
            </footer>
        </>
    );
};