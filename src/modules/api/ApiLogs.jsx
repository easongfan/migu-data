import React, { useState } from 'react';
import { Clock, AlertTriangle, Search, Filter } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import './ApiLogs.css';

const MOCK_LOGS = [
    { id: 1, time: '2023-10-24 10:30:01', method: 'GET', path: '/api/v1/player/stats', status: 200, latency: '45ms', ip: '192.168.1.10' },
    { id: 2, time: '2023-10-24 10:30:05', method: 'POST', path: '/api/v1/match/event', status: 201, latency: '120ms', ip: '192.168.1.12' },
    { id: 3, time: '2023-10-24 10:31:12', method: 'GET', path: '/api/v1/weather', status: 500, latency: '500ms', ip: '10.0.0.5' },
    { id: 4, time: '2023-10-24 10:32:00', method: 'GET', path: '/api/v1/player/rank', status: 200, latency: '800ms', ip: '192.168.1.10', slow: true },
    { id: 5, time: '2023-10-24 10:32:45', method: 'GET', path: '/api/v1/team/info', status: 403, latency: '12ms', ip: '172.16.0.1' },
];

const ApiLogs = () => {
    const [filter, setFilter] = useState('all'); // 'all' | 'error' | 'slow'

    const filteredLogs = MOCK_LOGS.filter(log => {
        if (filter === 'error') return log.status >= 400;
        if (filter === 'slow') return log.slow || parseInt(log.latency) > 200;
        return true;
    });

    return (
        <div className="api-logs fade-in">
            <div className="logs-header">
                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        全部日志
                    </button>
                    <button
                        className={`filter-tab ${filter === 'error' ? 'active' : ''}`}
                        onClick={() => setFilter('error')}
                    >
                        <AlertTriangle size={14} />
                        异常告警
                    </button>
                    <button
                        className={`filter-tab ${filter === 'slow' ? 'active' : ''}`}
                        onClick={() => setFilter('slow')}
                    >
                        <Clock size={14} />
                        慢查询监控
                    </button>
                </div>

                <div className="search-box">
                    <Search size={16} />
                    <input type="text" placeholder="搜索路径或 IP..." />
                </div>
            </div>

            <div className="logs-table-container">
                <table className="logs-table">
                    <thead>
                        <tr>
                            <th>时间</th>
                            <th>方法</th>
                            <th>请求路径</th>
                            <th>状态码</th>
                            <th>延迟</th>
                            <th>客户端 IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map(log => (
                            <tr key={log.id} className={log.status >= 400 ? 'row-error' : ''}>
                                <td className="text-muted">{log.time}</td>
                                <td>
                                    <Badge variant="default" className="scale-90">{log.method}</Badge>
                                </td>
                                <td className="font-mono text-sm">{log.path}</td>
                                <td>
                                    <Badge variant={log.status >= 500 ? 'error' : log.status >= 400 ? 'warning' : 'success'}>
                                        {log.status}
                                    </Badge>
                                </td>
                                <td className={parseInt(log.latency) > 200 ? 'text-warning' : ''}>
                                    {log.latency}
                                </td>
                                <td className="text-muted">{log.ip}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApiLogs;
