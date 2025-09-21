import React from 'react';
import { Link } from 'react-router-dom';

export const PoetryPage: React.FC = () => {
    return (
        // 使用您在 index.css 中定义的全局样式，让页面风格统一
        <div className="content subpage-content">
            <h1 className="content-title">诗歌展示</h1>

            <p style={{ color: 'var(--text-color-main)', margin: '2rem 0' }}>
                这里将展示我的诗歌作品...
            </p>

            {/* 返回首页的按钮 */}
            <div>
                <Link to="/" className="nav-button">返回首页</Link>
            </div>
        </div>
    );
};