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
        metrics: []
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
                {/* Basic Info */}
                <Card title="基本信息" icon={Settings}>
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
                <Card title="自定义指标" icon={Activity}>
                    <div className="empty-state-small">
                        <p>暂无自定义指标配置</p>
                        <Button size="sm" variant="ghost" icon={Plus}>添加指标</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ApiEditor;
