import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { BootSequence } from './components/BootSequence';
import PrismBackground from './components/PrismBackground';
import SimpleMouseFollowText from './components/SimpleMouseFollowText';

import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PoetryPage } from './pages/PoetryPage.tsx';
import { DesignPage } from './pages/DesignPage';
import { MaogaiPage } from './pages/MaogaiPage';
import { XinshiPage } from './pages/XinshiPage';


function App() {
    // 使用一个 state 来管理启动动画是否完成
    const [bootFinished, setBootFinished] = useState(false);
    const location = useLocation();
    
    // 根据当前路径设置不同的文字内容
    const getMouseFollowText = () => {
        switch (location.pathname) {
            case '/':
                return '✦ • 探索创意边界 • 追寻灵感轨迹 • 创造数字艺术 • ';
            case '/poetry':
                return '✨ • 诗意流淌 • 文字之美 • 心灵的声音 • ';
            case '/design':
                return '✨ • 设计之道 • 美学探索 • 视觉语言 • ';
            case '/xinshi':
                return '✨ • 新诗韵律 • 现代表达 • 情感流淌 • ';
            case '/maogai':
                return '✨ • 毛概智慧 • 理论探索 • 思想之光 • ';
            default:
                return '✦ • 探索创意边界 • 追寻灵感轨迹 • 创造数字艺术 • ';
        }
    };

    useEffect(() => {
        // 检查 sessionStorage，如果之前已经启动过，就直接跳过动画
        const hasBooted = sessionStorage.getItem('alreadyBooted');
        if (hasBooted) {
            setBootFinished(true);
        }
    }, []);

    // 这个函数会作为 prop 传给 BootSequence 组件
    const handleBootFinish = () => {
        sessionStorage.setItem('alreadyBooted', 'true');
        setBootFinished(true);
    };

    return (
        <>
            {/* Prism 3D 背景 */}
            <PrismBackground style="cosmic" intensity="medium" />
            
            {/* 鼠标跟随文字效果 */}
            <SimpleMouseFollowText
                text={getMouseFollowText()}
                enabled={bootFinished}
            />

            {bootFinished ? (
                // 3. 在这里定义路由规则
                <Routes>
                    {/* 路径为 "/" (根路径) 时，渲染 HomePage 组件 */}
                    <Route path="/" element={<HomePage />} />

                    {/* 路径为 "/poetry" 时，渲染 PoetryPage 组件 */}
                    <Route path="/poetry" element={<PoetryPage />} />

                    <Route path="/design" element={<DesignPage />} />

                    <Route path="/xinshi" element={<XinshiPage />} />

                    <Route path="/maogai" element={<MaogaiPage />} />

                    <Route path="*" element={<NotFoundPage />} />

                    {/* 为你的其他页面添加更多 Route */}
                </Routes>
            ) : (
                <BootSequence onBootFinish={handleBootFinish} />
            )}
        </>
    );
}

export default App;
