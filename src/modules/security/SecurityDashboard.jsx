import React, { useState } from 'react';
import { Shield, Lock, Globe, FileText, AlertTriangle, Check, X, User, Key, Activity, Server } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import './SecurityDashboard.css';

const SecurityDashboard = () => {
    const [activeTab, setActiveTab] = useState('access'); // access, network, audit

    // Mock Data
    const [accessRequests, setAccessRequests] = useState([
        { id: 1, user: 'zhang_san', role: 'Operator', api: 'Match Data API', status: 'pending', time: '10 mins ago' },
        { id: 2, user: 'li_si', role: 'Viewer', api: 'Player Stats API', status: 'pending', time: '1 hour ago' },
    ]);

    const [wafLogs, setWafLogs] = useState([
        { id: 101, ip: '192.168.1.55', type: 'SQL Injection', action: 'Blocked', time: '2023-10-27 10:30:00' },
        { id: 102, ip: '10.0.0.4', type: 'XSS Attack', action: 'Blocked', time: '2023-10-27 11:15:22' },
        { id: 103, ip: '172.16.0.100', type: 'DDoS Attempt', action: 'Mitigated', time: '2023-10-27 11:20:00' },
    ]);

    const [auditLogs, setAuditLogs] = useState([
        { id: 201, user: 'admin', action: 'Deleted Node', target: 'Process_A', time: '2023-10-27 09:00:00', status: 'Success' },
        { id: 202, user: 'operator', action: 'Modified Config', target: 'Source_B', time: '2023-10-27 09:15:00', status: 'Success' },
        { id: 203, user: 'unknown', action: 'Login Failed', target: 'System', time: '2023-10-27 09:20:00', status: 'Failed' },
    ]);

    const handleApprove = (id) => {
        setAccessRequests(prev => prev.filter(req => req.id !== id));
        // In a real app, this would call an API
    };

    const handleReject = (id) => {
        setAccessRequests(prev => prev.filter(req => req.id !== id));
    };

    return (
        <div className="security-dashboard fade-in">
            <div className="dashboard-tabs">
                <button className={`dash-tab ${activeTab === 'access' ? 'active' : ''}`} onClick={() => setActiveTab('access')}>
                    <Lock size={18} /> 访问控制 (Access)
                </button>
                <button className={`dash-tab ${activeTab === 'network' ? 'active' : ''}`} onClick={() => setActiveTab('network')}>
                    <Globe size={18} /> 网络安全 (Network)
                </button>
                <button className={`dash-tab ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>
                    <FileText size={18} /> 审计与日志 (Audit)
                </button>
            </div>

            <div className="dashboard-content">
                {activeTab === 'access' && (
                    <div className="access-panel">
                        <div className="section-header">
                            <h3><Key size={20} /> 权限申请审批 (Subscription Requests)</h3>
                        </div>
                        <div className="requests-grid">
                            {accessRequests.length === 0 ? (
                                <div className="empty-state">暂无待审批请求</div>
                            ) : (
                                accessRequests.map(req => (
                                    <Card key={req.id} className="request-card">
                                        <div className="req-info">
                                            <div className="req-user">
                                                <User size={16} />
                                                <span>{req.user}</span>
                                                <Badge variant="secondary">{req.role}</Badge>
                                            </div>
                                            <div className="req-detail">
                                                申请访问: <strong>{req.api}</strong>
                                            </div>
                                            <div className="req-time">{req.time}</div>
                                        </div>
                                        <div className="req-actions">
                                            <Button size="sm" variant="success" icon={Check} onClick={() => handleApprove(req.id)}>通过</Button>
                                            <Button size="sm" variant="danger" icon={X} onClick={() => handleReject(req.id)}>拒绝</Button>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>

                        <div className="section-header mt-6">
                            <h3><Shield size={20} /> 接口授权矩阵 (Authorization Matrix)</h3>
                        </div>
                        <Card className="matrix-card">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>API Resource</th>
                                        <th>Admin</th>
                                        <th>Operator</th>
                                        <th>Viewer</th>
                                        <th>External</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>/api/v1/match/live</td>
                                        <td><Check size={16} className="text-success" /></td>
                                        <td><Check size={16} className="text-success" /></td>
                                        <td><Check size={16} className="text-success" /></td>
                                        <td><X size={16} className="text-muted" /></td>
                                    </tr>
                                    <tr>
                                        <td>/api/v1/system/config</td>
                                        <td><Check size={16} className="text-success" /></td>
                                        <td><X size={16} className="text-muted" /></td>
                                        <td><X size={16} className="text-muted" /></td>
                                        <td><X size={16} className="text-muted" /></td>
                                    </tr>
                                    <tr>
                                        <td>/api/v1/data/export</td>
                                        <td><Check size={16} className="text-success" /></td>
                                        <td><Check size={16} className="text-success" /></td>
                                        <td><X size={16} className="text-muted" /></td>
                                        <td><Check size={16} className="text-success" /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </Card>
                    </div>
                )}

                {activeTab === 'network' && (
                    <div className="network-panel">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <Card className="stat-card">
                                <div className="stat-header">
                                    <span>WAF 状态</span>
                                    <Activity size={20} className="text-success" />
                                </div>
                                <div className="stat-value text-success">Running</div>
                                <div className="stat-desc">已拦截 12 次恶意请求 (今日)</div>
                            </Card>
                            <Card className="stat-card">
                                <div className="stat-header">
                                    <span>VPN 网关</span>
                                    <Server size={20} className="text-primary" />
                                </div>
                                <div className="stat-value text-primary">Active</div>
                                <div className="stat-desc">当前在线连接: 5</div>
                            </Card>
                        </div>

                        <div className="section-header">
                            <h3><AlertTriangle size={20} /> 网络攻击防护日志 (WAF Logs)</h3>
                        </div>
                        <Card className="logs-card">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Source IP</th>
                                        <th>Attack Type</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {wafLogs.map(log => (
                                        <tr key={log.id}>
                                            <td>{log.time}</td>
                                            <td>{log.ip}</td>
                                            <td><Badge variant="danger">{log.type}</Badge></td>
                                            <td>{log.action}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>

                        <div className="section-header mt-6">
                            <h3><Globe size={20} /> NAT 端口映射 (NAT Gateway)</h3>
                        </div>
                        <Card className="nat-card">
                            <div className="nat-row header">
                                <span>External Port</span>
                                <span>Internal Service</span>
                                <span>Internal Port</span>
                                <span>Status</span>
                            </div>
                            <div className="nat-row">
                                <span>8080</span>
                                <span>API Gateway</span>
                                <span>3000</span>
                                <Badge variant="success">Active</Badge>
                            </div>
                            <div className="nat-row">
                                <span>8443</span>
                                <span>Secure Data Stream</span>
                                <span>4000</span>
                                <Badge variant="success">Active</Badge>
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'audit' && (
                    <div className="audit-panel">
                        <div className="section-header">
                            <h3><FileText size={20} /> 系统操作审计 (Audit Trail)</h3>
                        </div>
                        <Card className="audit-card">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>User</th>
                                        <th>Action</th>
                                        <th>Target</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {auditLogs.map(log => (
                                        <tr key={log.id}>
                                            <td>{log.time}</td>
                                            <td>{log.user}</td>
                                            <td>{log.action}</td>
                                            <td>{log.target}</td>
                                            <td>
                                                <Badge variant={log.status === 'Success' ? 'success' : 'danger'}>
                                                    {log.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SecurityDashboard;
