import React, { useState } from 'react';
import { BarChart, Activity, AlertTriangle, LayoutGrid, Settings, Terminal, FileText, Calendar, TrendingUp, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import ApiList from './ApiList';
import ApiEditor from './ApiEditor';
import ApiDebugger from './ApiDebugger';
import ApiLogs from './ApiLogs';
import './ApiDashboard.css';

const ApiDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [manageView, setManageView] = useState('list'); // 'list' | 'editor'
    const [editingApi, setEditingApi] = useState(null);

    const handleEditApi = (api) => {
        setEditingApi(api);
        setManageView('editor');
    };

    const handleCreateApi = () => {
        setEditingApi(null);
        setManageView('editor');
    };

    const handleSaveApi = (config) => {
        console.log('Saved:', config);
        setManageView('list');
    };

    return (
        <div className="api-dashboard fade-in">
            {/* Tab Navigation */}
            <div className="dashboard-tabs">
                <button
                    className={`dash-tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    <LayoutGrid size={18} />
                    概览监控
                </button>
                <button
                    className={`dash-tab ${activeTab === 'manage' ? 'active' : ''}`}
                    onClick={() => setActiveTab('manage')}
                >
                    <Settings size={18} />
                    API 管理
                </button>
                <button
                    className={`dash-tab ${activeTab === 'debug' ? 'active' : ''}`}
                    onClick={() => setActiveTab('debug')}
                >
                    <Terminal size={18} />
                    调试测试
                </button>
                <button
                    className={`dash-tab ${activeTab === 'logs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('logs')}
                >
                    <FileText size={18} />
                    日志与告警
                </button>
            </div>

            <div className="dashboard-content">
                {activeTab === 'overview' && (
                    <div className="metrics-grid">
                        {/* Requirement 3.b: Daily, Monthly, Cumulative Stats */}
                        <Card className="metric-card">
                            <div className="metric-header">
                                <span className="metric-title">今日请求 (Daily)</span>
                                <Clock size={20} className="text-primary" />
                            </div>
                            <div className="metric-value">12.5万</div>
                            <div className="metric-trend success">↑ 5% 相比昨日</div>
                            <div className="mock-chart">
                                {[20, 35, 40, 50, 60, 55, 70].map((h, i) => (
                                    <div key={i} className="chart-bar" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                        </Card>

                        <Card className="metric-card">
                            <div className="metric-header">
                                <span className="metric-title">本月请求 (Monthly)</span>
                                <Calendar size={20} className="text-accent" />
                            </div>
                            <div className="metric-value">340万</div>
                            <div className="metric-trend success">↑ 12% 相比上月</div>
                            <div className="mock-chart">
                                {[40, 55, 45, 60, 75, 65, 80].map((h, i) => (
                                    <div key={i} className="chart-bar warning" style={{ height: `${h}%`, background: 'var(--accent)' }} />
                                ))}
                            </div>
                        </Card>

                        <Card className="metric-card">
                            <div className="metric-header">
                                <span className="metric-title">累计调用 (Total)</span>
                                <TrendingUp size={20} className="text-success" />
                            </div>
                            <div className="metric-value">1.2亿</div>
                            <div className="metric-trend">自系统上线</div>
                            <div className="mock-chart">
                                {[10, 20, 30, 45, 60, 80, 100].map((h, i) => (
                                    <div key={i} className="chart-bar success" style={{ height: `${h}%`, background: 'var(--success)' }} />
                                ))}
                            </div>
                        </Card>

                        <Card className="metric-card">
                            <div className="metric-header">
                                <span className="metric-title">平均延迟</span>
                                <Activity size={20} className="text-warning" />
                            </div>
                            <div className="metric-value">42ms</div>
                            <div className="metric-trend success">↓ 5ms 相比上周</div>
                        </Card>

                        <Card className="metric-card">
                            <div className="metric-header">
                                <span className="metric-title">错误率</span>
                                <AlertTriangle size={20} className="text-error" />
                            </div>
                            <div className="metric-value">0.05%</div>
                            <div className="metric-trend error">↑ 0.01% 相比上周</div>
                        </Card>
                    </div>
                )}

                {activeTab === 'manage' && (
                    manageView === 'list' ? (
                        <ApiList onEdit={handleEditApi} onCreate={handleCreateApi} />
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="mb-2">
                                <button onClick={() => setManageView('list')} className="text-sm text-muted hover:text-primary">
                                    ← 返回列表
                                </button>
                            </div>
                            <ApiEditor
                                initialData={editingApi}
                                onSave={handleSaveApi}
                            />
                        </div>
                    )
                )}

                {activeTab === 'debug' && <ApiDebugger />}
                {activeTab === 'logs' && <ApiLogs />}
            </div>
        </div>
    );
};

export default ApiDashboard;
