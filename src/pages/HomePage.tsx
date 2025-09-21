import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import styles from './HomePage.module.css';
import avatarImg from '../assets/neoAvater.png';
import Shuffle from '../components/Shuffle';

export const HomePage: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const mainWrapper = wrapperRef.current;
        const contentCard = contentRef.current;
        if (!mainWrapper || !contentCard) return;

        const MAX_TILT_EFFECT = 6;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = contentCard.getBoundingClientRect();
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);
            const tiltX = (y / (rect.height / 2)) * MAX_TILT_EFFECT * -1;
            const tiltY = (x / (rect.width / 2)) * MAX_TILT_EFFECT;

            requestAnimationFrame(() => {
                if (contentCard) {
                    contentCard.style.transform = `perspective(1500px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
                }
            });
        };

        const handleMouseLeave = () => {
            requestAnimationFrame(() => {
                if (contentCard) {
                    contentCard.style.transform = `perspective(1500px) rotateX(0deg) rotateY(0deg)`;
                }
            });
        };

        mainWrapper.addEventListener('mousemove', handleMouseMove);
        mainWrapper.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            if (mainWrapper) {
                mainWrapper.removeEventListener('mousemove', handleMouseMove);
                mainWrapper.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);

    return (
        <div
            className={`${styles.mainWrapper} ${isLoaded ? styles.loaded : ''}`}
            ref={wrapperRef}
        >
            <div className={styles.content} ref={contentRef}>
                <div className={styles.leftSection}>
                    <img src={avatarImg} alt="兹暂客头像" className={styles.avatar} />
                    <h1 className={styles.title}>
                        <span className={`${styles.revealableLine}`}>这里是</span>
                        <span className={`${styles.revealableLine} ${styles.goldText}`}>兹暂客</span>
                        <Shuffle 
                            text="Tempsyche"
                            className={styles.shuffleText}
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
                            style={{
                                fontSize: 'inherit',
                                color: 'rgba(255, 215, 0, 0.95)',
                                fontWeight: '400',
                                letterSpacing: '-0.5px',
                                lineHeight: 'inherit',
                                opacity: 1,
                                display: 'inline-block'
                            }}
                        />
                    </h1>
                    <div className={styles.education}>
                        <div className={styles.eduLine}>同济大学</div>
                        <div className={styles.eduLine}>视觉传达设计与人工智能</div>
                        <div className={styles.eduLine}>双学士学位在读</div>
                    </div>
                </div>
                <div className={styles.rightSection}>
                    <div className={styles.buttonContainer}>
                        <Link to="/poetry" className={styles.navButton}>诗歌展示</Link>
                        <Link to="/design" className={styles.navButton}>设计作品</Link>
                        <Link to="/xinshi" className={styles.navButton}>新诗汇报</Link>
                        <Link to="/maogai" className={styles.navButton}>毛概专题</Link>
                        <Link to="/projects" className={styles.navButton}>最近项目</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};