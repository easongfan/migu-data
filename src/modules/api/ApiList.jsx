import React from 'react';
import { MoreHorizontal, Edit, Trash2, Play, Plus, Shield } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import './ApiList.css';

const MOCK_APIS = [
    { id: 1, name: '获取球员信息', method: 'GET', endpoint: '/api/v1/player/info', status: 'active', qps: 120, auth: 'API_KEY' },
    { id: 2, name: '更新比赛比分', method: 'POST', endpoint: '/api/v1/match/score', status: 'active', qps: 50, auth: 'OAUTH2' },
    { id: 3, name: '删除无效数据', method: 'DELETE', endpoint: '/api/v1/data/clean', status: 'inactive', qps: 0, auth: 'ADMIN' },
    { id: 4, name: '查询天气状况', method: 'GET', endpoint: '/api/v1/weather', status: 'active', qps: 200, auth: 'NONE' },
];

const ApiList = ({ onEdit, onCreate }) => {
    return (
        <div className="api-list fade-in">
            <div className="list-header">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold">API 列表</h2>
                    <Badge variant="default">{MOCK_APIS.length} 个接口</Badge>
                </div>
                <Button icon={Plus} onClick={onCreate}>新建 API</Button>
            </div>

            <div className="apis-grid">
                {MOCK_APIS.map(api => (
                    <Card key={api.id} className="api-card">
                        <div className="api-card-header">
                            <Badge variant={api.method === 'GET' ? 'primary' : api.method === 'POST' ? 'success' : 'warning'}>
                                {api.method}
                            </Badge>
                            <div className="api-actions">
                                <button className="action-btn" onClick={() => onEdit(api)}>
                                    <Edit size={16} />
                                </button>
                                <button className="action-btn text-primary" title="申请订阅">
                                    <Shield size={16} />
                                </button>
                                <button className="action-btn text-error">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="api-card-body">
                            <h3 className="api-name">{api.name}</h3>
                            <code className="api-endpoint">{api.endpoint}</code>
                        </div>

                        <div className="api-card-footer">
                            <div className="footer-item">
                                <span className="label">状态</span>
                                <span className={`value ${api.status === 'active' ? 'text-success' : 'text-muted'}`}>
                                    {api.status === 'active' ? '运行中' : '已停用'}
                                </span>
                            </div>
                            <div className="footer-item">
                                <span className="label">QPS</span>
                                <span className="value">{api.qps}</span>
                            </div>
                            <div className="footer-item">
                                <span className="label">认证</span>
                                <span className="value">{api.auth}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ApiList;
