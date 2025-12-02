import React, { useState } from 'react';
import { Play, RotateCcw, Code } from 'lucide-react';
import Button from '../../components/ui/Button';
import './ApiDebugger.css';

const ApiDebugger = () => {
    const [method, setMethod] = useState('GET');
    const [url, setUrl] = useState('https://api.migu.cn/v1/player/stats');
    const [headers, setHeaders] = useState([{ key: 'Authorization', value: 'Bearer pk_test_...' }]);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSend = () => {
        setLoading(true);
        // Simulate network request
        setTimeout(() => {
            setResponse({
                status: 200,
                time: '45ms',
                size: '1.2KB',
                data: {
                    player_id: "P1001",
                    name: "Lionel Messi",
                    goals: 32,
                    assists: 18,
                    matches: 34
                }
            });
            setLoading(false);
        }, 800);
    };

    return (
        <div className="api-debugger fade-in">
            <div className="request-panel">
                <div className="url-bar">
                    <select
                        className="method-select"
                        value={method}
                        onChange={e => setMethod(e.target.value)}
                    >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                    </select>
                    <input
                        type="text"
                        className="url-input"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                    />
                    <Button icon={Play} onClick={handleSend} disabled={loading}>
                        {loading ? '发送中...' : '发送'}
                    </Button>
                </div>

                <div className="params-section">
                    <h3 className="section-title">请求头 (Headers)</h3>
                    {headers.map((h, i) => (
                        <div key={i} className="header-row">
                            <input type="text" className="param-input" value={h.key} readOnly />
                            <input type="text" className="param-input flex-1" value={h.value} readOnly />
                        </div>
                    ))}
                </div>
            </div>

            <div className="response-panel">
                <div className="response-header">
                    <h3 className="section-title">响应结果</h3>
                    {response && (
                        <div className="response-meta">
                            <span className="meta-tag success">{response.status} OK</span>
                            <span className="meta-tag">{response.time}</span>
                            <span className="meta-tag">{response.size}</span>
                        </div>
                    )}
                </div>

                <div className="response-body">
                    {response ? (
                        <pre className="json-view">
                            {JSON.stringify(response.data, null, 2)}
                        </pre>
                    ) : (
                        <div className="empty-response">
                            <Code size={48} />
                            <p>发送请求以查看响应</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApiDebugger;
