import React, { useState } from 'react';
import { Save, Plus, Trash2, Settings, Shield, Activity } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import './ApiEditor.css';

const ApiEditor = ({ onSave }) => {
    const [apiConfig, setApiConfig] = useState({
        name: '',
        endpoint: '/api/v1/',
        method: 'GET',
        description: '',
        authType: 'API_KEY',
        rateLimit: 1000,
        whitelist: [],
        metrics: [],
        dataScope: 'SINGLE' // 'SINGLE' or 'CROSS'
    });

    const [whitelistIp, setWhitelistIp] = useState('');

    const handleAddIp = () => {
        if (whitelistIp && !apiConfig.whitelist.includes(whitelistIp)) {
            setApiConfig({ ...apiConfig, whitelist: [...apiConfig.whitelist, whitelistIp] });
            setWhitelistIp('');
        }
    };

    const handleRemoveIp = (ip) => {
        setApiConfig({ ...apiConfig, whitelist: apiConfig.whitelist.filter(i => i !== ip) });
    };

    return (
        <div className="api-editor fade-in">
            <div className="editor-header">
                <h2 className="text-lg font-semibold">新建/编辑 API</h2>
                <Button icon={Save} onClick={() => onSave(apiConfig)}>保存配置</Button>
            </div>

            <div className="editor-grid">
                {/* Data Mapping */}
                <Card title="数据源映射 (Data Mapping)" icon={Activity} className="col-span-full">
                    <div className="mapping-container">
                        {/* 1. Scope Selection */}
                        <div className="mapping-section">
                            <label className="section-label">1. 数据范围 (Data Scope)</label>
                            <div className="scope-selector">
                                <button
                                    className={`scope-btn ${apiConfig.dataScope === 'SINGLE' ? 'active' : ''}`}
                                    onClick={() => setApiConfig({ ...apiConfig, dataScope: 'SINGLE' })}
                                >
                                    <div className="scope-icon">⚽</div>
                                    <div className="scope-info">
                                        <span className="scope-title">单场赛事 (Single Match)</span>
                                        <span className="scope-desc">仅获取指定单场比赛的数据</span>
                                    </div>
                                </button>
                                <button
                                    className={`scope-btn ${apiConfig.dataScope === 'CROSS' ? 'active' : ''}`}
                                    onClick={() => setApiConfig({ ...apiConfig, dataScope: 'CROSS' })}
                                >
                                    <div className="scope-icon">🌐</div>
                                    <div className="scope-info">
                                        <span className="scope-title">跨赛事聚合 (Cross-Match)</span>
                                        <span className="scope-desc">自由组合多场比赛数据 (支持 1.2.6.d)</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* 2. Source Selection */}
                        <div className="mapping-section">
                            <label className="section-label">2. 数据源选择 (Select Sources)</label>
                            <div className="sources-grid">
                                <div className="source-card selected">
                                    <div className="source-icon-wrapper rest">REST</div>
                                    <div className="source-details">
                                        <span className="source-name">咪咕体育 API</span>
                                        <span className="source-status success">● 已连接</span>
                                    </div>
                                    <div className="checkbox-indicator">✓</div>
                                </div>
                                <div className="source-card">
                                    <div className="source-icon-wrapper ws">WS</div>
                                    <div className="source-details">
                                        <span className="source-name">实时比赛 Socket</span>
                                        <span className="source-status success">● 活跃</span>
                                    </div>
                                    <div className="checkbox-indicator"></div>
                                </div>
                                <div className="source-card">
                                    <div className="source-icon-wrapper db">DB</div>
                                    <div className="source-details">
                                        <span className="source-name">历史统计数据库</span>
                                        <span className="source-status warning">● 同步中</span>
                                    </div>
                                    <div className="checkbox-indicator"></div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Schema Definition */}
                        <div className="mapping-section">
                            <div className="flex justify-between items-center mb-2">
                                <label className="section-label mb-0">3. 响应结构定义 (Response Schema)</label>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="ghost">自动生成</Button>
                                    <Button size="sm" variant="secondary">导入模版</Button>
                                </div>
                            </div>
                            <div className="code-editor-mock">
                                <div className="line-numbers">
                                    {Array.from({ length: 8 }).map((_, i) => <div key={i}>{i + 1}</div>)}
                                </div>
                                <textarea
                                    className="code-textarea"
                                    spellCheck="false"
                                    defaultValue={`{
  "code": 200,
  "message": "success",
  "data": {
    "matches": [
      { "matchId": "String", "homeScore": "Number", "awayScore": "Number" }
    ],
    "aggregatedStats": {
      "totalGoals": "Number",
      "averagePossession": "Number"
    }
  }
}`}
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Basic Info */}
                <Card title="API 接口定义 (Interface Definition)" icon={Settings}>
                    <div className="form-group">
                        <label>API 名称</label>
                        <input
                            type="text"
                            className="form-input"
                            value={apiConfig.name}
                            onChange={e => setApiConfig({ ...apiConfig, name: e.target.value })}
                            placeholder="例如：获取球员信息"
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group w-1/4">
                            <label>请求方法</label>
                            <select
                                className="form-select"
                                value={apiConfig.method}
                                onChange={e => setApiConfig({ ...apiConfig, method: e.target.value })}
                            >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="DELETE">DELETE</option>
                            </select>
                        </div>
                        <div className="form-group flex-1">
                            <label>Endpoint 路径</label>
                            <input
                                type="text"
                                className="form-input"
                                value={apiConfig.endpoint}
                                onChange={e => setApiConfig({ ...apiConfig, endpoint: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>描述</label>
                        <textarea
                            className="form-textarea"
                            rows="3"
                            value={apiConfig.description}
                            onChange={e => setApiConfig({ ...apiConfig, description: e.target.value })}
                        />
                    </div>
                </Card>

                {/* Security & Access */}
                <Card title="权限与安全" icon={Shield}>
                    <div className="form-group">
                        <label>认证方式</label>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="authType"
                                    checked={apiConfig.authType === 'API_KEY'}
                                    onChange={() => setApiConfig({ ...apiConfig, authType: 'API_KEY' })}
                                />
                                API Key
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="authType"
                                    checked={apiConfig.authType === 'OAUTH2'}
                                    onChange={() => setApiConfig({ ...apiConfig, authType: 'OAUTH2' })}
                                />
                                OAuth 2.0
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="authType"
                                    checked={apiConfig.authType === 'NONE'}
                                    onChange={() => setApiConfig({ ...apiConfig, authType: 'NONE' })}
                                />
                                公开 (无认证)
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>授权角色 (Authorization)</label>
                        <div className="checkbox-group flex gap-4">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" defaultChecked /> 管理员 (Admin)
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" defaultChecked /> 操作员 (Operator)
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" /> 普通用户 (Viewer)
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>速率限制 (QPS)</label>
                        <input
                            type="number"
                            className="form-input"
                            value={apiConfig.rateLimit}
                            onChange={e => setApiConfig({ ...apiConfig, rateLimit: parseInt(e.target.value) })}
                        />
                    </div>

                    <div className="form-group">
                        <label>IP 白名单</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="输入 IP 地址"
                                value={whitelistIp}
                                onChange={e => setWhitelistIp(e.target.value)}
                            />
                            <Button size="sm" variant="secondary" icon={Plus} onClick={handleAddIp}>添加</Button>
                        </div>
                        <div className="tags-container">
                            {apiConfig.whitelist.map(ip => (
                                <span key={ip} className="ip-tag">
                                    {ip}
                                    <button onClick={() => handleRemoveIp(ip)}><Trash2 size={12} /></button>
                                </span>
                            ))}
                            {apiConfig.whitelist.length === 0 && <span className="text-muted text-sm">未配置白名单</span>}
                        </div>
                    </div>
                </Card>

                {/* Custom Metrics */}

                {/* Custom Metrics */}
                <Card title="自定义指标" icon={Activity}>
                    <div className="empty-state-small">
                        <p>暂无自定义指标配置</p>
                        <Button size="sm" variant="ghost" icon={Plus}>添加指标</Button>
                    </div>
                </Card>
            </div>
        </div >
    );
};

export default ApiEditor;
