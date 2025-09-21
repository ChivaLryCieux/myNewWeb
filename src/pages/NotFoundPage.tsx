// src/pages/NotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            color: 'white',
            textAlign: 'center'
        }}>
            <h1>页面仍在建设中</h1>
            <p>你访问的路径尚未完工</p>
            <Link to="/" style={{ color: '#00ffff', marginTop: '1rem' }}>
                返回首页
            </Link>
        </div>
    );
};