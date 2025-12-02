import React, { useState, useRef, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import {
    Plus, Save, Play, ZoomIn, ZoomOut,
    Settings, Database, ArrowRight, Calculator, Split, Merge,
    Eye, Trash2, Globe, Copy, Check, Activity, Monitor
} from 'lucide-react';
import ProcessingNode from './ProcessingNode';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import './ProcessingCanvas.css';

const INITIAL_NODES = [
    { id: 1, type: 'source', label: '比赛数据 API', x: 100, y: 150, config: { url: 'https://api.migu.cn/v1/match/live' } },
    { id: 2, type: 'transform', label: '事件过滤', x: 450, y: 150, config: { filter: 'type == "GOAL"' } },
    { id: 3, type: 'output-ue', label: 'UE5 渲染引擎', x: 800, y: 150, config: { ip: '192.168.1.100', port: '8888' } },
];

const INITIAL_CONNECTIONS = [
    { id: 'c1', source: 1, target: 2 },
    { id: 'c2', source: 2, target: 3 }
];

const VERSIONS = ['v1.0.0 (当前)', 'v0.9.5', 'v0.9.0'];

const MOCK_PREVIEW_DATA = {
    input: {
        matchId: "123456",
        timestamp: 1698123456789,
        events: [
            { type: "GOAL", player: "Messi", minute: 23 },
            { type: "FOUL", player: "Neymar", minute: 25 }
        ]
    },
    output: {
        renderId: "evt_001",
        graphicType: "LOWER_THIRD_GOAL",
        data: {
            name: "Messi",
            time: "23'"
        }
    }
};

const ProcessingCanvas = () => {
    const [nodes, setNodes] = useState(INITIAL_NODES);
    const [connections, setConnections] = useState(INITIAL_CONNECTIONS);
    const [selectedNode, setSelectedNode] = useState(null);
    const [showPreview, setShowPreview] = useState(true);
    const [currentVersion, setCurrentVersion] = useState(VERSIONS[0]);

    // Connection Interaction State
    const [isConnecting, setIsConnecting] = useState(false);
    const [tempConnection, setTempConnection] = useState(null);

    // Preview Panel State
    const [previewHeight, setPreviewHeight] = useState(200);
    const [isResizing, setIsResizing] = useState(false);

    // API Publish State
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [publishedApi, setPublishedApi] = useState(null);
    const [isCopied, setIsCopied] = useState(false);

    const canvasRef = useRef(null);

    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            if (isResizing) {
                const newHeight = window.innerHeight - e.clientY;
                setPreviewHeight(Math.max(100, Math.min(newHeight, 600)));
            }
        };

        const handleGlobalMouseUp = () => {
            if (isResizing) {
                setIsResizing(false);
            }
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleGlobalMouseMove);
            window.addEventListener('mouseup', handleGlobalMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isResizing]);

    // Helper to get node position
    const getNodePos = (id) => {
        const node = nodes.find(n => n.id === id);
        return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
    };

    // Calculate path string
    const getPath = (start, end) => {
        // Node width is 200px, handle is at right: -6px -> 206px
        const sx = start.x + 206;
        // Node height is approx 80px, handle is vertically centered
        const sy = start.y + 40;

        // Input handle is at left: -6px
        const ex = end.x - 6;
        const ey = end.y + 40;

        const controlPoint1 = { x: sx + (ex - sx) / 2, y: sy };
        const controlPoint2 = { x: sx + (ex - sx) / 2, y: ey };

        return `M ${sx} ${sy} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${ex} ${ey}`;
    };

    const handleNodeDrag = (id, newPos) => {
        setNodes(prevNodes => prevNodes.map(n => n.id === id ? { ...n, x: newPos.x, y: newPos.y } : n));
    };

    const handleAddNode = (type, label) => {
        const newNode = {
            id: Date.now(),
            type,
            label,
            x: 100 + Math.random() * 50,
            y: 100 + Math.random() * 50,
            config: {}
        };
        setNodes([...nodes, newNode]);
    };

    const handleDeleteNode = (id) => {
        setNodes(nodes.filter(n => n.id !== id));
        setConnections(connections.filter(c => c.source !== id && c.target !== id));
        if (selectedNode?.id === id) setSelectedNode(null);
    };

    const handleNodeSelect = (id) => {
        const node = nodes.find(n => n.id === id);
        setSelectedNode(node);
    };

    const updateNodeConfig = (key, value) => {
        if (!selectedNode) return;
        const updatedNodes = nodes.map(n =>
            n.id === selectedNode.id ? { ...n, config: { ...n.config, [key]: value } } : n
        );
        setNodes(updatedNodes);
        setSelectedNode({ ...selectedNode, config: { ...selectedNode.config, [key]: value } });
    };

    // Connection Handlers
    const handleConnectStart = (sourceId, e) => {
        const node = nodes.find(n => n.id === sourceId);
        if (!node) return;

        const startX = node.x + 206;
        const startY = node.y + 40;

        setIsConnecting(true);
        setTempConnection({
            sourceId,
            startX,
            startY,
            currX: startX,
            currY: startY
        });
    };

    const handleMouseMove = (e) => {
        if (!isConnecting || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        setTempConnection(prev => ({
            ...prev,
            currX: mouseX,
            currY: mouseY
        }));
    };

    const handleConnectEnd = (targetId) => {
        if (!isConnecting || !tempConnection) return;

        if (tempConnection.sourceId !== targetId) {
            const exists = connections.some(c => c.source === tempConnection.sourceId && c.target === targetId);
            if (!exists) {
                setConnections(prev => [...prev, {
                    id: `c_${Date.now()}`,
                    source: tempConnection.sourceId,
                    target: targetId
                }]);
            }
        }

        setIsConnecting(false);
        setTempConnection(null);
    };

    const handleMouseUp = () => {
        if (isConnecting) {
            setIsConnecting(false);
            setTempConnection(null);
        }
    };

    const handlePublishApi = (e) => {
        e.preventDefault();
        // Mock API Generation
        const apiData = {
            url: `https://api.migu.cn/v1/live/${selectedNode.id}_${Date.now()}`,
            method: 'GET',
            token: 'sk_live_51Mz...'
        };
        setPublishedApi(apiData);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="processing-module" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            {/* Top Toolbar */}
            <div className="toolbar glass-panel">
                <div className="toolbar-group">
                    <span className="toolbar-label">节点工具:</span>
                    <Button size="sm" icon={Database} onClick={() => handleAddNode('source', '数据源')}>数据源</Button>
                    <Button size="sm" icon={Settings} onClick={() => handleAddNode('transform', '处理')}>处理</Button>
                    <Button size="sm" icon={Activity} onClick={() => handleAddNode('analysis', '高阶分析')}>高阶分析</Button>
                    <Button size="sm" icon={Calculator} onClick={() => handleAddNode('calc', '计算')}>计算</Button>
                    <Button size="sm" icon={Split} onClick={() => handleAddNode('split', '拆分')}>拆分</Button>
                    <Button size="sm" icon={Merge} onClick={() => handleAddNode('merge', '合并')}>合并</Button>
                    <Button size="sm" icon={Monitor} onClick={() => handleAddNode('output-ue', 'UE/Vizrt')}>UE输出</Button>
                    <Button size="sm" icon={ArrowRight} onClick={() => handleAddNode('output', 'API输出')}>API输出</Button>
                </div>

                <div className="toolbar-divider" />

                <div className="toolbar-group">
                    <span className="toolbar-label">版本:</span>
                    <select
                        className="version-select"
                        value={currentVersion}
                        onChange={(e) => setCurrentVersion(e.target.value)}
                    >
                        {VERSIONS.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <Button size="sm" variant="secondary" icon={Save}>保存版本</Button>
                </div>

                <div className="toolbar-divider" />

                <div className="toolbar-group ml-auto">
                    <Button size="sm" variant={showPreview ? 'primary' : 'secondary'} icon={Eye} onClick={() => setShowPreview(!showPreview)}>
                        {showPreview ? '隐藏预览' : '显示预览'}
                    </Button>
                    <Button size="sm" variant="success" icon={Play}>运行测试</Button>
                </div>
            </div>

            <div className="main-workspace">
                {/* Canvas Area */}
                <div className="canvas-container" ref={canvasRef}>
                    <div className="canvas-grid-bg" />
                    <svg className="connections-layer">
                        {connections.map(conn => {
                            const start = getNodePos(conn.source);
                            const end = getNodePos(conn.target);
                            return (
                                <path
                                    key={conn.id}
                                    d={getPath(start, end)}
                                    stroke="#3b82f6"
                                    strokeWidth="2"
                                    fill="none"
                                    className="connection-line"
                                />
                            );
                        })}
                        {isConnecting && tempConnection && (
                            <path
                                d={`M ${tempConnection.startX} ${tempConnection.startY} C ${tempConnection.startX + 50} ${tempConnection.startY}, ${tempConnection.currX - 50} ${tempConnection.currY}, ${tempConnection.currX} ${tempConnection.currY}`}
                                stroke="#3b82f6"
                                strokeWidth="2"
                                strokeDasharray="5,5"
                                fill="none"
                            />
                        )}
                    </svg>
                    {nodes.map(node => (
                        <ProcessingNode
                            key={node.id}
                            {...node}
                            isSelected={selectedNode?.id === node.id}
                            onSelect={handleNodeSelect}
                            onDrag={handleNodeDrag}
                            onDelete={handleDeleteNode}
                            onConnectStart={handleConnectStart}
                            onConnectEnd={handleConnectEnd}
                        />
                    ))}
                </div>

                {/* Right Properties Panel */}
                {selectedNode && (
                    <div className="properties-panel glass-panel fade-in-right">
                        <div className="panel-header">
                            <h3>属性配置</h3>
                            <Badge variant="default">{selectedNode.type}</Badge>
                        </div>

                        <div className="panel-content">
                            <div className="form-group">
                                <label>节点名称</label>
                                <input
                                    value={selectedNode.label}
                                    onChange={(e) => {
                                        const updatedNodes = nodes.map(n => n.id === selectedNode.id ? { ...n, label: e.target.value } : n);
                                        setNodes(updatedNodes);
                                        setSelectedNode({ ...selectedNode, label: e.target.value });
                                    }}
                                />
                            </div>

                            {selectedNode.type === 'source' && (
                                <>
                                    <div className="form-group">
                                        <label>API 地址 (URL)</label>
                                        <input
                                            value={selectedNode.config.url || ''}
                                            onChange={(e) => updateNodeConfig('url', e.target.value)}
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>请求方法</label>
                                        <select>
                                            <option>GET</option>
                                            <option>POST</option>
                                            <option>WEBSOCKET</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {selectedNode.type === 'analysis' && (
                                <>
                                    <div className="form-group">
                                        <label>分析算法</label>
                                        <select
                                            value={selectedNode.config.algorithm || 'speed'}
                                            onChange={(e) => updateNodeConfig('algorithm', e.target.value)}
                                        >
                                            <option value="speed">瞬时速度计算</option>
                                            <option value="distance">跑动距离统计</option>
                                            <option value="heatmap">热力图生成</option>
                                            <option value="trajectory">轨迹平滑处理</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>采样频率 (Hz)</label>
                                        <input
                                            type="number"
                                            value={selectedNode.config.frequency || 25}
                                            onChange={(e) => updateNodeConfig('frequency', e.target.value)}
                                        />
                                    </div>
                                </>
                            )}

                            {selectedNode.type === 'output-ue' && (
                                <>
                                    <div className="form-group">
                                        <label>引擎类型</label>
                                        <select
                                            value={selectedNode.config.engine || 'UE5'}
                                            onChange={(e) => updateNodeConfig('engine', e.target.value)}
                                        >
                                            <option value="UE5">Unreal Engine 5</option>
                                            <option value="Vizrt">Vizrt Engine</option>
                                            <option value="Ross">Ross Voyager</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>目标 IP 地址</label>
                                        <input
                                            value={selectedNode.config.ip || ''}
                                            onChange={(e) => updateNodeConfig('ip', e.target.value)}
                                            placeholder="192.168.1.x"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>端口 (Port)</label>
                                        <input
                                            value={selectedNode.config.port || ''}
                                            onChange={(e) => updateNodeConfig('port', e.target.value)}
                                            placeholder="8888"
                                        />
                                    </div>
                                </>
                            )}

                            {selectedNode.type === 'transform' && (
                                <>
                                    <div className="form-group">
                                        <label>过滤条件</label>
                                        <textarea
                                            value={selectedNode.config.filter || ''}
                                            onChange={(e) => updateNodeConfig('filter', e.target.value)}
                                            placeholder="e.g. type == 'GOAL'"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>字段映射</label>
                                        <div className="mapping-row">
                                            <input placeholder="源字段" />
                                            <ArrowRight size={14} />
                                            <input placeholder="目标字段" />
                                        </div>
                                        <Button size="sm" variant="ghost" icon={Plus}>添加映射</Button>
                                    </div>
                                </>
                            )}

                            {selectedNode.type === 'output' && (
                                <>
                                    <div className="form-group">
                                        <label>目标 Endpoint</label>
                                        <input
                                            value={selectedNode.config.endpoint || ''}
                                            onChange={(e) => updateNodeConfig('endpoint', e.target.value)}
                                        />
                                    </div>
                                    <div className="api-preview">
                                        <label>生成的 API 接口</label>
                                        <div className="code-block">
                                            POST /api/v1/playout/trigger
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-border">
                                        <Button
                                            className="w-full"
                                            icon={Globe}
                                            onClick={() => {
                                                setPublishedApi(null);
                                                setIsPublishModalOpen(true);
                                            }}
                                        >
                                            发布为数据服务 API
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="panel-footer">
                            <Button variant="danger" icon={Trash2} onClick={() => handleDeleteNode(selectedNode.id)}>删除节点</Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Data Preview Panel */}
            {showPreview && (
                <div
                    className="preview-panel glass-panel fade-in-up"
                    style={{ height: previewHeight }}
                >
                    <div
                        className="resize-handle"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            setIsResizing(true);
                        }}
                    />
                    <div className="panel-header">
                        <h3>数据预览</h3>
                        <div className="preview-tabs">
                            <span className="active">实时数据</span>
                            <span>日志</span>
                        </div>
                    </div>
                    <div className="preview-content">
                        <div className="data-column">
                            <h4>输入数据 (Input)</h4>
                            <pre>{JSON.stringify(MOCK_PREVIEW_DATA.input, null, 2)}</pre>
                        </div>
                        <div className="data-divider">
                            <ArrowRight size={20} />
                        </div>
                        <div className="data-column">
                            <h4>输出结果 (Output)</h4>
                            <pre>{JSON.stringify(MOCK_PREVIEW_DATA.output, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            )}

            {/* Publish API Modal */}
            <Modal
                isOpen={isPublishModalOpen}
                onClose={() => setIsPublishModalOpen(false)}
                title="发布数据服务 API"
            >
                {!publishedApi ? (
                    <form onSubmit={handlePublishApi} className="flex flex-col gap-4">
                        <div className="form-group">
                            <label className="text-sm text-secondary mb-1 block">API 名称</label>
                            <input className="w-full bg-surface border border-border rounded p-2 text-primary" defaultValue={`Data_Service_${Date.now()}`} />
                        </div>
                        <div className="form-group">
                            <label className="text-sm text-secondary mb-1 block">版本</label>
                            <input className="w-full bg-surface border border-border rounded p-2 text-primary" defaultValue="v1.0.0" />
                        </div>
                        <div className="form-group">
                            <label className="text-sm text-secondary mb-1 block">访问权限</label>
                            <select className="w-full bg-surface border border-border rounded p-2 text-primary">
                                <option>公开 (Public)</option>
                                <option>需授权 (Authenticated)</option>
                                <option>内部专用 (Internal)</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsPublishModalOpen(false)}>取消</Button>
                            <Button type="submit">确认发布</Button>
                        </div>
                    </form>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="bg-success/10 text-success p-3 rounded-md flex items-center gap-2">
                            <Check size={18} />
                            <span>API 发布成功！</span>
                        </div>

                        <div className="form-group">
                            <label className="text-sm text-secondary mb-1 block">接口地址 (URL)</label>
                            <div className="flex gap-2">
                                <code className="flex-1 bg-black p-2 rounded text-sm font-mono text-primary">{publishedApi.url}</code>
                                <Button size="sm" variant="secondary" icon={isCopied ? Check : Copy} onClick={() => copyToClipboard(publishedApi.url)}>
                                    {isCopied ? '已复制' : '复制'}
                                </Button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="text-sm text-secondary mb-1 block">请求方式</label>
                            <Badge variant="default">{publishedApi.method}</Badge>
                        </div>

                        <div className="form-group">
                            <label className="text-sm text-secondary mb-1 block">访问令牌 (Token)</label>
                            <code className="block bg-black p-2 rounded text-sm font-mono text-secondary break-all">{publishedApi.token}</code>
                        </div>

                        <div className="flex justify-end mt-4">
                            <Button onClick={() => setIsPublishModalOpen(false)}>关闭</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ProcessingCanvas;
