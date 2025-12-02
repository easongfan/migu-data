import React, { useState } from 'react';
import { Book, Code2, Plus, Search, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import './ReferenceManagement.css';

const MOCK_DICTS = [
    { id: 1, name: '比赛状态', code: 'MATCH_STATUS', items: 5, description: '比赛进行阶段定义' },
    { id: 2, name: '球员位置', code: 'PLAYER_POSITION', items: 12, description: '足球场上球员位置' },
    { id: 3, name: '天气类型', code: 'WEATHER_TYPE', items: 8, description: '比赛场地天气情况' },
];

const MOCK_CODES = [
    { id: 1, name: '国家地区', code: 'COUNTRY_REGION', version: 'v1.0', items: 240 },
    { id: 2, name: '赛事级别', code: 'TOURNAMENT_LEVEL', version: 'v1.2', items: 6 },
];

const ReferenceManagement = () => {
    const [activeTab, setActiveTab] = useState('dict'); // 'dict' | 'code'
    const [searchTerm, setSearchTerm] = useState('');

    const data = activeTab === 'dict' ? MOCK_DICTS : MOCK_CODES;

    return (
        <div className="reference-module fade-in">
            <div className="reference-header">
                <div className="tab-switcher">
                    <button
                        className={`tab-btn ${activeTab === 'dict' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dict')}
                    >
                        <Book size={18} />
                        数据字典
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`}
                        onClick={() => setActiveTab('code')}
                    >
                        <Code2 size={18} />
                        公共代码
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder={`搜索${activeTab === 'dict' ? '字典' : '代码'}...`}
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button icon={Plus}>新建{activeTab === 'dict' ? '字典' : '代码'}</Button>
                </div>
            </div>

            <div className="reference-grid">
                {data.map(item => (
                    <Card key={item.id} className="reference-card">
                        <div className="card-header">
                            <div className={`icon-box ${activeTab === 'dict' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                {activeTab === 'dict' ? <Book size={20} /> : <Code2 size={20} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="card-title">{item.name}</h3>
                                <code className="card-code">{item.code}</code>
                            </div>
                            <button className="more-btn">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>

                        <div className="card-body">
                            <p className="card-desc">{item.description || '暂无描述'}</p>
                            <div className="card-stats">
                                <div className="stat-item">
                                    <span className="stat-label">条目数</span>
                                    <span className="stat-value">{item.items}</span>
                                </div>
                                {item.version && (
                                    <div className="stat-item">
                                        <span className="stat-label">版本</span>
                                        <Badge variant="default">{item.version}</Badge>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="card-footer">
                            <Button size="sm" variant="ghost" icon={Edit}>编辑</Button>
                            <Button size="sm" variant="ghost" className="text-error" icon={Trash2}>删除</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ReferenceManagement;
