import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Code, Globe } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import './ModelEditor.css';

const FIELD_TYPES = ['String', 'Number', 'Boolean', 'Date', 'Array', 'Object'];
const MODEL_TYPES = ['状态数据 (Status)', '结果数据 (Result)'];

const ModelEditor = ({ onSave, onCancel }) => {
    const [fields, setFields] = useState([
        { id: 1, name: 'id', type: 'String', required: true },
        { id: 2, name: 'timestamp', type: 'Date', required: true },
    ]);
    const [modelType, setModelType] = useState(MODEL_TYPES[0]);
    const [previewJson, setPreviewJson] = useState('');

    useEffect(() => {
        // Generate mock JSON based on fields
        const mock = {};
        fields.forEach(f => {
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
    }, [fields]);

    const addField = () => {
        setFields([...fields, { id: Date.now(), name: '', type: 'String', required: false }]);
    };

    const removeField = (id) => {
        setFields(fields.filter(f => f.id !== id));
    };

    const updateField = (id, key, value) => {
        setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        onSave({
            name: formData.get('name'),
            description: formData.get('description'),
            type: modelType,
            fields
        });
    };

    return (
        <form onSubmit={handleSubmit} className="model-editor">
            <div className="editor-layout">
                <div className="editor-form">
                    <div className="form-group">
                        <label className="label">模型名称</label>
                        <input name="name" className="input" placeholder="例如：球员统计" required />
                    </div>

                    <div className="form-group">
                        <label className="label">模型类型</label>
                        <select
                            className="input"
                            value={modelType}
                            onChange={e => setModelType(e.target.value)}
                        >
                            {MODEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="label">描述</label>
                        <textarea name="description" className="input textarea" placeholder="描述该数据模型..." rows={2} />
                    </div>

                    <div className="fields-section">
                        <div className="fields-header">
                            <label className="label">Schema 字段</label>
                            <Button type="button" size="sm" variant="ghost" icon={Plus} onClick={addField}>添加字段</Button>
                        </div>

                        <div className="fields-list">
                            {fields.map(field => (
                                <div key={field.id} className="field-row">
                                    <input
                                        className="input field-name"
                                        placeholder="字段名"
                                        value={field.name}
                                        onChange={e => updateField(field.id, 'name', e.target.value)}
                                        required
                                    />
                                    <select
                                        className="input field-type"
                                        value={field.type}
                                        onChange={e => updateField(field.id, 'type', e.target.value)}
                                    >
                                        {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={field.required}
                                            onChange={e => updateField(field.id, 'required', e.target.checked)}
                                        />
                                        <span className="checkbox-text">必填</span>
                                    </label>
                                    <button type="button" className="delete-btn" onClick={() => removeField(field.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="editor-preview">
                    <div className="preview-section">
                        <div className="preview-header">
                            <Code size={16} />
                            <span>JSON 结构预览</span>
                        </div>
                        <pre className="code-preview">{previewJson}</pre>
                    </div>

                    <div className="preview-section">
                        <div className="preview-header">
                            <Globe size={16} />
                            <span>生成的 API 接口</span>
                        </div>
                        <div className="api-preview-box">
                            <Badge variant="success">GET</Badge>
                            <code className="api-url">/api/v1/models/{'{model_id}'}/data</code>
                        </div>
                        <div className="api-preview-box mt-2">
                            <Badge variant="default">POST</Badge>
                            <code className="api-url">/api/v1/models/{'{model_id}'}/ingest</code>
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-actions">
                <Button type="button" variant="ghost" onClick={onCancel}>取消</Button>
                <Button type="submit">创建模型</Button>
            </div>
        </form>
    );
};

export default ModelEditor;
