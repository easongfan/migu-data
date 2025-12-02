import React, { useState, useEffect } from 'react';
import { Code, Globe, Table, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import './ModelPreview.css';

const ModelPreview = ({ model, onClose }) => {
    const [previewJson, setPreviewJson] = useState('');

    useEffect(() => {
        if (!model || !model.fields) return;

        // Generate mock JSON based on fields
        const mock = {};
        model.fields.forEach(f => {
            switch (f.type) {
                case 'String': mock[f.name] = "sample_text"; break;
                case 'Number': mock[f.name] = 123; break;
                case 'Boolean': mock[f.name] = true; break;
                case 'Date': mock[f.name] = new Date().toISOString(); break;
                case 'Array': mock[f.name] = []; break;
                case 'Object': mock[f.name] = {}; break;
                default: mock[f.name] = null;
            }
        });
        setPreviewJson(JSON.stringify(mock, null, 2));
    }, [model]);

    if (!model) return null;

    return (
        <div className="model-preview">
            <div className="preview-layout">
                {/* Left Column: Schema Info */}
                <div className="preview-info">
                    <div className="info-group">
                        <label className="info-label">模型名称</label>
                        <div className="info-value text-lg font-bold">{model.name}</div>
                    </div>

                    <div className="info-group">
                        <label className="info-label">类型</label>
                        <Badge variant={model.type.includes('Status') ? 'warning' : 'success'}>
                            {model.type}
                        </Badge>
                    </div>

                    <div className="info-group">
                        <label className="info-label">描述</label>
                        <div className="info-value">{model.description}</div>
                    </div>

                    <div className="info-group flex-1 flex flex-col min-h-0">
                        <div className="flex items-center gap-2 mb-2">
                            <Table size={16} className="text-secondary" />
                            <label className="info-label mb-0">字段定义 (Schema)</label>
                        </div>
                        <div className="schema-table-container">
                            <table className="schema-table">
                                <thead>
                                    <tr>
                                        <th>字段名</th>
                                        <th>类型</th>
                                        <th>必填</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {model.fields.map((field, idx) => (
                                        <tr key={idx}>
                                            <td>{field.name}</td>
                                            <td><code className="type-badge">{field.type}</code></td>
                                            <td>{field.required ? <span className="text-error">•</span> : <span className="text-muted">-</span>}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Data & API Preview */}
                <div className="preview-demo">
                    <div className="demo-section">
                        <div className="demo-header">
                            <Code size={16} />
                            <span>数据预览 (JSON)</span>
                        </div>
                        <pre className="code-preview">{previewJson}</pre>
                    </div>

                    <div className="demo-section">
                        <div className="demo-header">
                            <Globe size={16} />
                            <span>API 接口调用</span>
                        </div>
                        <div className="api-box">
                            <div className="api-method">GET</div>
                            <code className="api-url">/api/v1/models/{model.id}/data</code>
                        </div>
                        <div className="api-box">
                            <div className="api-method post">POST</div>
                            <code className="api-url">/api/v1/models/{model.id}/ingest</code>
                        </div>
                    </div>
                </div>
            </div>

            <div className="preview-footer">
                <Button onClick={onClose}>关闭</Button>
            </div>
        </div>
    );
};

export default ModelPreview;
