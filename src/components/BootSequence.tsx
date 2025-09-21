import React, { useEffect } from 'react';
import styles from './BootSequence.module.css';

// 类型定义 (未改变)
type TextMessage = {
    text: string;
    type: 'text' | 'status' | 'textfinal';
    duration?: number;
};
type LoaderMessage = {
    type: 'loader';
    duration: number;
    steps: number;
};
type BootMessage = TextMessage | LoaderMessage;

type BootSequenceProps = {
    onBootFinish: () => void;
};

export const BootSequence: React.FC<BootSequenceProps> = ({ onBootFinish }) => {
    useEffect(() => {
        const bootTextEl = document.getElementById('boot-text');
        const bootLoaderContainer = document.getElementById('boot-loader-container');
        const bootLoaderBar = document.getElementById('boot-loader-bar');

        if (!bootTextEl || !bootLoaderContainer || !bootLoaderBar) {
            onBootFinish();
            return;
        }

        // [关键修改]：精简动画序列，并加快了进度条速度
        const bootMessages: BootMessage[] = [
            { text: "INITIATING INTERFACE V5...\n", type: 'text' },
            { type: 'loader', duration: 1500, steps: 20 },
            { text: "万一禅关砉然破，美人如玉剑如虹。\n\nWELCOME, TEMPSYCHE.\n", type: 'textfinal' }
        ];

        const timerIds: number[] = [];

        // proceedBootSequence 作为统一入口
        let currentBootMsgIndex = -1;
        let charIndex = 0;

        // 封装 setTimeout，方便追踪
        const customSetTimeout = (callback: () => void, delay: number) => {
            const id = window.setTimeout(callback, delay);
            timerIds.push(id);
        };

        // typeBootText 函数，只负责打字
        const typeBootText = () => {
            const message = bootMessages[currentBootMsgIndex] as TextMessage;

            if (charIndex < message.text.length) {
                bootTextEl.textContent += message.text[charIndex];
                charIndex++;
                customSetTimeout(typeBootText, Math.random() * 40 + 20); // 打字速度微调
            } else {
                customSetTimeout(proceedBootSequence, message.duration || 800);
            }
        };

        // updateLoader 函数
        const updateLoader = (step: number, totalSteps: number, duration: number) => {
            const progress = (step / totalSteps) * 100;
            bootLoaderBar.style.width = `${progress}%`;
            if (step < totalSteps) {
                customSetTimeout(() => updateLoader(step + 1, totalSteps, duration), duration / totalSteps);
            } else {
                bootTextEl.textContent += "]";
                customSetTimeout(proceedBootSequence, 500);
            }
        };

        // proceedBootSequence "总指挥"函数
        const proceedBootSequence = () => {
            charIndex = 0;
            currentBootMsgIndex++;
            if (currentBootMsgIndex < bootMessages.length) {
                const message = bootMessages[currentBootMsgIndex];
                bootLoaderContainer.style.display = 'none';

                if (message.type === 'text' || message.type === 'status' || message.type === 'textfinal') {
                    if (message.type === 'textfinal') {
                        // 这个判断会自动在显示最终文字前清空屏幕
                        bootTextEl.textContent = "";
                    }
                    typeBootText();
                } else if (message.type === 'loader') {
                    bootTextEl.textContent += "\nPROGRESS: [ONLINE";
                    bootLoaderContainer.style.display = 'block';
                    bootLoaderBar.style.width = "0%";
                    updateLoader(1, message.steps, message.duration);
                }
            } else {
                customSetTimeout(() => {
                    onBootFinish();
                }, 500);
            }
        };

        // 统一从此入口启动动画序列
        proceedBootSequence();

        // 返回清理函数
        return () => {
            timerIds.forEach(id => clearTimeout(id));
        };

    }, [onBootFinish]);

    return (
        <div className={styles.bootSequence}>
            <div className={styles.bootTextContainer}>
                <p id="boot-text" className={styles.bootText}></p>
            </div>
            <div id="boot-loader-container" className={styles.bootLoaderContainer}>
                <div id="boot-loader-bar" className={styles.bootLoaderBar}></div>
            </div>
            <p id="boot-status" className={styles.bootStatus}></p>
        </div>
    );
};