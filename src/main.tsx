// import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    // React严格模式，用它包裹应用程序或其任何一部分时，它会为这部分代码及其所有后代组件启用额外的检查和警告，只在开发模式下运行，不会影响生产环境的构建和性能
    // <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    // </React.StrictMode>
);
