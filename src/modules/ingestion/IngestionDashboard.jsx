import React, { useState } from 'react';
import {
    Plus, RefreshCw, Activity, Database, Globe, Server,
    Calendar, Search, Settings, Play, Clock, Trash2, Filter,
    HardDrive, Archive, RotateCcw, Download
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import './IngestionDashboard.css';

// --- Mock Data ---
const MOCK_SOURCES = [
    { id: 1, name: '咪咕体育 API', type: 'REST API', status: '已连接', lastSync: '刚刚', icon: Globe },
    { id: 2, name: '实时比赛 Socket', type: 'WebSocket', status: '已连接', lastSync: '2毫秒前', icon: Activity },
    { id: 3, name: '历史统计数据库', type: 'Database', status: '同步中', lastSync: '同步中...', icon: Database },
    { id: 4, name: '外部供应商数据流', type: 'REST API', status: '错误', lastSync: '5分钟前失败', icon: Server },
];

const MOCK_TASKS = [
    { id: 1, name: '每日球员数据全量同步', schedule: '每天 03:00', lastRun: '今天 03:00', status: '成功', nextRun: '明天 03:00' },
    { id: 2, name: '赛事赛程更新', schedule: '每小时', lastRun: '14:00', status: '成功', nextRun: '15:00' },
    { id: 3, name: '实时赔率抓取', schedule: '每 5 分钟', lastRun: '14:55', status: '运行中', nextRun: '15:00' },
];

const MOCK_SEARCH_RESULTS = [
    { id: 101, time: '2023-10-24 14:30:01', source: '咪咕体育 API', type: 'PlayerStats', content: '{"playerId": "messi_10", "goals": 2, "assists": 1}' },
    { id: 102, time: '2023-10-24 14:30:05', source: '实时比赛 Socket', type: 'MatchEvent', content: '{"matchId": "ucl_final", "event": "GOAL", "minute": 23}' },
    { id: 103, time: '2023-10-24 14:30:12', source: '外部供应商', type: 'OddsUpdate', content: '{"matchId": "ucl_final", "homeWin": 1.85, "draw": 3.40}' },
];

const MOCK_BACKUPS = [
    { id: 1, name: '全量备份_20231024', size: '45.2 GB', time: '2023-10-24 02:00', type: '自动' },
    { id: 2, name: '增量备份_20231024_1200', size: '1.2 GB', time: '2023-10-24 12:00', type: '自动' },
    { id: 3, name: '手动备份_赛前', size: '44.8 GB', time: '2023-10-23 18:30', type: '手动' },
];

// --- Sub-components ---

const OverviewTab = ({ sources, onAddSource }) => (
    <div className="dashboard-grid fade-in">
        <div className="stats-row">
            <Card className="stat-card">
                <div className="stat-icon-wrapper success"><Activity size={24} /></div>
                <div className="stat-info"><span className="stat-label">活跃数据流</span><span className="stat-value">12</span></div>
            </Card>
            <Card className="stat-card">
                <div className="stat-icon-wrapper primary"><Database size={24} /></div>
                <div className="stat-info"><span className="stat-label">总记录数</span><span className="stat-value">840万</span></div>
            </Card>
            <Card className="stat-card">
                <div className="stat-icon-wrapper warning"><Server size={24} /></div>
                <div className="stat-info"><span className="stat-label">API 延迟</span><span className="stat-value">45ms</span></div>
            </Card>
        </div>

        <Card title="数据源列表" className="sources-list-card" action={
            <div className="flex gap-2">
                <Button variant="secondary" size="sm" icon={RefreshCw}>刷新</Button>
                <Button size="sm" icon={Plus} onClick={onAddSource}>添加数据源</Button>
            </div>
        }>
            <div className="sources-table-container">
                <table className="sources-table">
                    <thead>
                        <tr><th>数据源名称</th><th>类型</th><th>状态</th><th>上次同步</th><th>操作</th></tr>
                    </thead>
                    <tbody>
                        {sources.map((source) => (
                            <tr key={source.id}>
                                <td className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className="source-icon"><source.icon size={16} /></div>
                                        {source.name}
                                    </div>
                                </td>
                                <td><span className="text-muted">{source.type}</span></td>
                                <td><Badge variant={source.status === '已连接' ? 'success' : source.status === '同步中' ? 'warning' : 'error'}>{source.status}</Badge></td>
                                <td><span className="text-muted">{source.lastSync}</span></td>
                                <td><Button variant="ghost" size="sm">配置</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    </div>
);

const SchedulingTab = () => (
    <div className="scheduling-tab fade-in">
        <Card title="采集任务调度" action={<Button size="sm" icon={Plus}>新建任务</Button>}>
            <div className="sources-table-container">
                <table className="sources-table">
                    <thead>
                        <tr><th>任务名称</th><th>调度策略</th><th>上次运行</th><th>状态</th><th>下次运行</th><th>操作</th></tr>
                    </thead>
                    <tbody>
                        {MOCK_TASKS.map(task => (
                            <tr key={task.id}>
                                <td className="font-medium">{task.name}</td>
                                <td><div className="flex items-center gap-2"><Clock size={14} className="text-muted" /> {task.schedule}</div></td>
                                <td className="text-muted">{task.lastRun}</td>
                                <td><Badge variant={task.status === '成功' ? 'success' : 'warning'}>{task.status}</Badge></td>
                                <td className="text-muted">{task.nextRun}</td>
                                <td>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" icon={Play}>立即运行</Button>
                                        <Button variant="ghost" size="sm" icon={Settings}>编辑</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    </div>
);

const SearchTab = () => (
    <div className="search-tab fade-in">
        <Card className="search-filter-card">
            <div className="search-bar-large">
                <Search className="search-icon" />
                <input type="text" placeholder="输入关键词、ID 或数据内容进行检索..." className="search-input-large" />
                <Button>搜索</Button>
            </div>
            <div className="filters-row">
                <div className="filter-group">
                    <label>时间范围</label>
                    <select className="filter-select"><option>最近 1 小时</option><option>最近 24 小时</option><option>最近 7 天</option></select>
                </div>
                <div className="filter-group">
                    <label>数据源</label>
                    <select className="filter-select"><option>全部</option><option>咪咕体育 API</option></select>
                </div>
                <div className="filter-group">
                    <label>类型</label>
                    <select className="filter-select"><option>全部</option><option>PlayerStats</option><option>MatchEvent</option></select>
                </div>
            </div>
        </Card>

        <div className="search-results">
            {MOCK_SEARCH_RESULTS.map(result => (
                <Card key={result.id} className="result-item">
                    <div className="result-header">
                        <span className="result-type">{result.type}</span>
                        <span className="result-source">{result.source}</span>
                        <span className="result-time">{result.time}</span>
                    </div>
                    <div className="result-content">
                        <code>{result.content}</code>
                    </div>
                </Card>
            ))}
        </div>
    </div>
);

const CacheTab = () => (
    <div className="cache-tab fade-in">
        <div className="cache-grid">
            <Card title="缓存策略配置" className="cache-config-card">
                <div className="config-form">
                    <div className="form-group">
                        <label>全局缓存过期时间 (TTL)</label>
                        <div className="range-wrapper">
                            <input type="range" min="60" max="3600" defaultValue="600" className="range-input" />
                            <span className="range-value">10 分钟</span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>最大内存使用限制</label>
                        <div className="range-wrapper">
                            <input type="range" min="128" max="4096" defaultValue="1024" className="range-input" />
                            <span className="range-value">1024 MB</span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>淘汰策略</label>
                        <select className="filter-select w-full">
                            <option>LRU (最近最少使用)</option>
                            <option>LFU (最不经常使用)</option>
                            <option>FIFO (先进先出)</option>
                        </select>
                    </div>
                    <div className="form-actions">
                        <Button>保存配置</Button>
                    </div>
                </div>
            </Card>

            <Card title="缓存状态监控" className="cache-stats-card">
                <div className="cache-stats-grid">
                    <div className="cache-stat">
                        <span className="label">当前使用内存</span>
                        <span className="value">452 MB</span>
                        <div className="progress-bar"><div className="progress-fill" style={{ width: '45%' }}></div></div>
                    </div>
                    <div className="cache-stat">
                        <span className="label">缓存命中率</span>
                        <span className="value success">94.2%</span>
                        <div className="progress-bar"><div className="progress-fill success" style={{ width: '94%' }}></div></div>
                    </div>
                    <div className="cache-stat">
                        <span className="label">缓存条目数</span>
                        <span className="value">12,405</span>
                    </div>
                </div>
                <div className="cache-actions">
                    <Button variant="danger" icon={Trash2}>清除所有缓存</Button>
                    <Button variant="secondary" icon={RefreshCw}>预热缓存</Button>
                </div>
            </Card>
        </div>
    </div>
);

const BackupTab = () => (
    <div className="backup-tab fade-in">
        <div className="backup-grid">
            <Card title="存储与备份管理" className="backup-list-card" action={<Button size="sm" icon={Plus}>立即备份</Button>}>
                <div className="sources-table-container">
                    <table className="sources-table">
                        <thead>
                            <tr><th>备份名称</th><th>大小</th><th>备份时间</th><th>类型</th><th>操作</th></tr>
                        </thead>
                        <tbody>
                            {MOCK_BACKUPS.map(backup => (
                                <tr key={backup.id}>
                                    <td className="font-medium">{backup.name}</td>
                                    <td className="text-muted">{backup.size}</td>
                                    <td className="text-muted">{backup.time}</td>
                                    <td><Badge variant="default">{backup.type}</Badge></td>
                                    <td>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" icon={RotateCcw}>恢复</Button>
                                            <Button variant="ghost" size="sm" icon={Download}>下载</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card title="存储空间监控" className="storage-stats-card">
                <div className="cache-stats-grid">
                    <div className="cache-stat">
                        <span className="label">已用存储空间</span>
                        <span className="value">1.2 TB / 5 TB</span>
                        <div className="progress-bar"><div className="progress-fill warning" style={{ width: '24%' }}></div></div>
                    </div>
                    <div className="cache-stat">
                        <span className="label">本周新增数据</span>
                        <span className="value">128 GB</span>
                    </div>
                </div>
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-secondary mb-2">自动备份策略 (Scheduled Backup)</h4>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-sm text-primary bg-surface p-2 rounded">
                            <Clock size={14} />
                            <span>每天凌晨 02:00 执行全量备份，保留 30 天</span>
                            <Button size="sm" variant="ghost" className="ml-auto">修改</Button>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-primary bg-surface p-2 rounded">
                            <Clock size={14} />
                            <span>每 4 小时执行增量备份，保留 7 天</span>
                            <Button size="sm" variant="ghost" className="ml-auto">修改</Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    </div>
);

// --- Main Component ---

const IngestionDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [sources, setSources] = useState(MOCK_SOURCES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [delay, setDelay] = useState(0); // 0ms

    const handleAddSource = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newSource = {
            id: Date.now(),
            name: formData.get('name'),
            type: formData.get('type'),
            status: '已连接',
            lastSync: '刚刚',
            icon: Globe
        };
        setSources([...sources, newSource]);
        setIsModalOpen(false);
    };

    return (
        <div className="ingestion-dashboard">
            {/* Tabs Header */}
            <div className="tabs-header glass-panel">
                <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                    <Activity size={18} /> 概览与接入
                </button>
                <button className={`tab-btn ${activeTab === 'scheduling' ? 'active' : ''}`} onClick={() => setActiveTab('scheduling')}>
                    <Calendar size={18} /> 任务调度
                </button>
                <button className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>
                    <Search size={18} /> 数据检索
                </button>
                <button className={`tab-btn ${activeTab === 'cache' ? 'active' : ''}`} onClick={() => setActiveTab('cache')}>
                    <HardDrive size={18} /> 缓存配置
                </button>
                <button className={`tab-btn ${activeTab === 'backup' ? 'active' : ''}`} onClick={() => setActiveTab('backup')}>
                    <Archive size={18} /> 存储与备份
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'overview' && <OverviewTab sources={sources} onAddSource={() => setIsModalOpen(true)} />}
                {activeTab === 'scheduling' && <SchedulingTab />}
                {activeTab === 'search' && <SearchTab />}
                {activeTab === 'cache' && <CacheTab />}
                {activeTab === 'backup' && <BackupTab />}
            </div>

            {/* Add Source Modal (Shared) */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="添加新数据源">
                <form onSubmit={handleAddSource} className="flex flex-col gap-4">
                    <div className="form-group">
                        <label className="text-sm text-secondary mb-1 block">数据源名称</label>
                        <input name="name" className="w-full bg-surface border border-border rounded p-2 text-primary" placeholder="例如：球员统计 API" required />
                    </div>
                    <div className="form-group">
                        <label className="text-sm text-secondary mb-1 block">数据源类型</label>
                        <select name="type" className="w-full bg-surface border border-border rounded p-2 text-primary">
                            <option value="REST API">REST API</option>
                            <option value="WebSocket">WebSocket</option>
                            <option value="Database">数据库</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="text-sm text-secondary mb-1 block">接口地址 (Endpoint URL)</label>
                        <input name="url" className="w-full bg-surface border border-border rounded p-2 text-primary" placeholder="https://api.example.com/v1" />
                    </div>

                    <div className="form-group">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="encrypted" className="w-4 h-4" />
                            <span className="text-sm text-primary">启用敏感数据加密存储 (AES-256)</span>
                        </label>
                    </div>

                    {/* Requirement 3.a: Delay Control */}
                    <div className="form-group">
                        <label className="text-sm text-secondary mb-1 block">延时刷新设置 (10ms - 1h)</label>
                        <div className="range-wrapper">
                            <input
                                type="range"
                                min="10"
                                max="3600000"
                                step="100"
                                value={delay}
                                onChange={(e) => setDelay(parseInt(e.target.value))}
                                className="range-input"
                            />
                            <span className="range-value">
                                {delay < 1000 ? `${delay} ms` : delay < 60000 ? `${(delay / 1000).toFixed(1)} s` : `${(delay / 60000).toFixed(1)} min`}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>取消</Button>
                        <Button type="submit">连接数据源</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default IngestionDashboard;
