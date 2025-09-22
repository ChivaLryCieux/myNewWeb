import React from 'react';
import { Link } from 'react-router-dom';
import './PoetryPage.css';

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

export const PoetryPage: React.FC = () => {
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
                <Link to="/" className="nav-button return-button">
                    <span className="button-icon">←</span>
                    返回首页
                </Link>
            </div>
        </div>
    );
};