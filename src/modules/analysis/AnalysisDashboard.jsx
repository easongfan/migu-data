import React, { useState } from 'react';
import { Search, Database, Filter, Play, Code, Table as TableIcon, Plus, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import './AnalysisDashboard.css';

const MOCK_MODELS = [
    { id: 1, name: '球员统计', fields: ['player_id', 'match_id', 'goals', 'assists'] },
    { id: 2, name: '球队排名', fields: ['team_id', 'rank', 'points', 'wins'] },
    { id: 3, name: '比赛事件', fields: ['event_id', 'timestamp', 'type', 'metadata'] },
];

const AnalysisDashboard = () => {
    const [mode, setMode] = useState('visual'); // 'visual' | 'code'
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedFields, setSelectedFields] = useState([]);
    const [filters, setFilters] = useState([]);
    const [results, setResults] = useState(null);
    const [sqlQuery, setSqlQuery] = useState('SELECT * FROM player_stats WHERE goals > 0;');

    const handleAddField = (field) => {
        if (!selectedFields.includes(field)) {
            setSelectedFields([...selectedFields, field]);
        }
    };

    const handleRemoveField = (field) => {
        setSelectedFields(selectedFields.filter(f => f !== field));
    };

    const handleAddFilter = () => {
        setFilters([...filters, { field: '', operator: '=', value: '' }]);
    };

    const handleRunQuery = () => {
        // Mock execution
        setResults([
            { id: 1, col1: 'Data A', col2: 123, col3: '2023-10-01' },
            { id: 2, col1: 'Data B', col2: 456, col3: '2023-10-02' },
            { id: 3, col1: 'Data C', col2: 789, col3: '2023-10-03' },
        ]);
    };

    return (
        <div className="analysis-module fade-in">
            <div className="analysis-header">
                <div className="flex items-center gap-4">
                    <div className="mode-switch">
                        <button
                            className={`mode-btn ${mode === 'visual' ? 'active' : ''}`}
                            onClick={() => setMode('visual')}
                        >
                            <Filter size={16} />
                            可视化构建
                        </button>
                        <button
                            className={`mode-btn ${mode === 'code' ? 'active' : ''}`}
                            onClick={() => setMode('code')}
                        >
                            <Code size={16} />
                            自定义检索
                        </button>
                    </div>
                </div>
                <Button icon={Play} variant="primary" onClick={handleRunQuery}>执行查询</Button>
            </div>

            <div className="analysis-content">
                {/* Left Panel: Query Builder */}
                <div className="query-panel">
                    {mode === 'visual' ? (
                        <div className="visual-builder">
                            <div className="builder-section">
                                <label className="section-label">
                                    <Database size={16} />
                                    选择数据模型
                                </label>
                                <select
                                    className="model-select"
                                    value={selectedModel}
                                    onChange={(e) => {
                                        setSelectedModel(e.target.value);
                                        setSelectedFields([]);
                                    }}
                                >
                                    <option value="">请选择模型...</option>
                                    {MOCK_MODELS.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>

                            {selectedModel && (
                                <>
                                    <div className="builder-section">
                                        <label className="section-label">
                                            <TableIcon size={16} />
                                            选择字段
                                        </label>
                                        <div className="fields-grid">
                                            {MOCK_MODELS.find(m => m.id == selectedModel)?.fields.map(field => (
                                                <button
                                                    key={field}
                                                    className={`field-chip ${selectedFields.includes(field) ? 'active' : ''}`}
                                                    onClick={() => selectedFields.includes(field) ? handleRemoveField(field) : handleAddField(field)}
                                                >
                                                    {field}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="builder-section">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="section-label mb-0">
                                                <Filter size={16} />
                                                过滤条件
                                            </label>
                                            <Button size="sm" variant="ghost" icon={Plus} onClick={handleAddFilter}>添加</Button>
                                        </div>
                                        <div className="filters-list">
                                            {filters.map((filter, idx) => (
                                                <div key={idx} className="filter-row">
                                                    <select className="filter-input w-1/3">
                                                        <option value="">字段</option>
                                                        {MOCK_MODELS.find(m => m.id == selectedModel)?.fields.map(f => (
                                                            <option key={f} value={f}>{f}</option>
                                                        ))}
                                                    </select>
                                                    <select className="filter-input w-1/4">
                                                        <option value="=">=</option>
                                                        <option value=">">&gt;</option>
                                                        <option value="<">&lt;</option>
                                                        <option value="like">包含</option>
                                                    </select>
                                                    <input type="text" className="filter-input flex-1" placeholder="值" />
                                                    <button className="text-error hover:bg-error/10 p-1 rounded" onClick={() => setFilters(filters.filter((_, i) => i !== idx))}>
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                            {filters.length === 0 && (
                                                <div className="text-center text-muted text-sm py-4">暂无过滤条件</div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="code-editor-container">
                            <textarea
                                className="sql-editor"
                                value={sqlQuery}
                                onChange={(e) => setSqlQuery(e.target.value)}
                                placeholder="在此输入 SQL 查询语句..."
                            />
                            <div className="editor-help">
                                支持标准 SQL 语法。快捷键: Ctrl+Enter 执行查询。
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel: Results */}
                <div className="results-panel">
                    <div className="results-header">
                        <h3 className="text-lg font-semibold">查询结果</h3>
                        {results && <Badge variant="success">{results.length} 条记录</Badge>}
                    </div>

                    <div className="results-table-container">
                        {results ? (
                            <table className="results-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Column 1</th>
                                        <th>Column 2</th>
                                        <th>Column 3</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((row, idx) => (
                                        <tr key={idx}>
                                            <td>{row.id}</td>
                                            <td>{row.col1}</td>
                                            <td>{row.col2}</td>
                                            <td>{row.col3}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="empty-state">
                                <Search size={48} className="mb-4 opacity-20" />
                                <p>点击“执行查询”查看结果</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisDashboard;
