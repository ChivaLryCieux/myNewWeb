import React from 'react';
import { Link } from 'react-router-dom'; // 1. 导入 Link 组件用于导航

// 2. 导入样式和图片资源
import styles from './DesignPage.module.css';
import bushnellImg from '../assets/bushnell.jpg';
import symbolImg from '../assets/symbol.jpg';
import hanggaoImg from '../assets/hanggao.jpg';
import PixelTransition from '../components/PixelTransition';

export const DesignPage: React.FC = () => {
    // 设计作品数据，方便管理和渲染
    const designWorks = [
        {
            image: bushnellImg,
            alt: 'Bushnell纪念设计',
            caption: ['纪念Bushnell', '2024早春'],
            hoverText: '“美国，你会愤怒还是恐惧”',
            pixelColor: '#00ffff',
            gridSize: 8
        },
        {
            image: symbolImg,
            alt: '设计四秩序',
            caption: ['设计四秩序：符号', '2024春'],
            hoverText: '“符号，能指，与心”',
            pixelColor: '#FFD700',
            gridSize: 9
        },
        {
            image: hanggaoImg,
            alt: '航高设计封面',
            caption: ['为航高设计的资料封面', '2024隆冬'],
            hoverText: '“滋味庞杂”',
            pixelColor: '#ff6b6b',
            gridSize: 7
        }
    ];

    return (
        // 使用 subpage-content 等全局样式，同时应用本页面的模块化样式
        <div className={`content subpage-content ${styles.pageContainer}`}>

            <h1 className={`content-title ${styles.pageTitle}`}>设计展示</h1>

            <div className={styles.backButtonContainer}>
                <Link to="/" className={styles.backButton}>
                    <span className={styles.buttonIcon}>←</span>
                    返回首页
                </Link>
            </div>

            <div className={styles.galleryContainer}>
                {/* 4. 使用 PixelTransition 组件为图片添加像素转换效果 */}
                {designWorks.map((work, index) => (
                    <div key={index} className={styles.galleryItem}>
                        <PixelTransition
                            firstContent={
                                <div className={styles.imageContainer}>
                                    <img
                                        src={work.image}
                                        alt={work.alt}
                                        className={styles.galleryImage}
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
                                <div className={styles.hoverContent}>
                                    <div className={styles.hoverText}>
                                        {work.hoverText}
                                    </div>
                                </div>
                            }
                            gridSize={work.gridSize}
                            pixelColor={work.pixelColor}
                            animationStepDuration={0.4}
                            aspectRatio="100%" // 方形比例，更适合完整展示图片
                            style={{ 
                                width: '100%', 
                                maxWidth: '300px',
                                border: '2px solid var(--border-color-hud)',
                                borderRadius: '15px',
                                overflow: 'hidden'
                            }}
                        />
                        <p className={styles.galleryCaption}>
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
    );
};