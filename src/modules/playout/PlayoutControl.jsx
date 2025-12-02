import React, { useState } from 'react';
import { Play, Square, SkipForward, LayoutTemplate, Monitor, Edit3 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import './PlayoutControl.css';

const TEMPLATES = [
    { id: 1, name: '人名条 - 球员', category: '字幕条', thumbnail: 'linear-gradient(135deg, #1e3a8a, #3b82f6)' },
    { id: 2, name: '比分牌 - 顶部', category: '比分牌', thumbnail: 'linear-gradient(135deg, #064e3b, #10b981)' },
    { id: 3, name: '首发阵容', category: '全屏', thumbnail: 'linear-gradient(135deg, #7f1d1d, #ef4444)' },
    { id: 4, name: '比赛统计', category: '全屏', thumbnail: 'linear-gradient(135deg, #4c1d95, #8b5cf6)' },
];

const PlayoutControl = () => {
    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
    const [isOnAir, setIsOnAir] = useState(false);
    const [previewData, setPreviewData] = useState({
        line1: '莱昂内尔·梅西',
        line2: '前锋 - 巴黎圣日耳曼',
        stat: '进球: 12'
    });

    const handleTake = () => {
        setIsOnAir(true);
    };

    const handleClear = () => {
        setIsOnAir(false);
    };

    return (
        <div className="playout-module fade-in">
            <div className="playout-grid">
                {/* Left: Template Gallery */}
                <div className="gallery-section">
                    <h3 className="section-title">模版库</h3>
                    <div className="template-grid">
                        {TEMPLATES.map(template => (
                            <div
                                key={template.id}
                                className={`template-item ${selectedTemplate.id === template.id ? 'selected' : ''}`}
                                onClick={() => setSelectedTemplate(template)}
                            >
                                <div className="template-thumb" style={{ background: template.thumbnail }}>
                                    <LayoutTemplate size={24} className="text-white opacity-50" />
                                </div>
                                <div className="template-info">
                                    <span className="template-name">{template.name}</span>
                                    <span className="template-cat">{template.category}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center: Preview & Edit */}
                <div className="preview-section">
                    <Card className="preview-card">
                        <div className="preview-header">
                            <span className="preview-label">预览</span>
                            <Badge variant="default">就绪</Badge>
                        </div>
                        <div className="preview-window">
                            {/* Mock Graphic Render */}
                            <div className="mock-graphic">
                                <div className="graphic-content">
                                    <h2>{previewData.line1}</h2>
                                    <p>{previewData.line2}</p>
                                    <div className="graphic-stat">{previewData.stat}</div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="data-card">
                        <div className="data-header">
                            <Edit3 size={16} />
                            <span>数据修改</span>
                        </div>
                        <div className="data-form">
                            <div className="form-group">
                                <label>第一行</label>
                                <input
                                    value={previewData.line1}
                                    onChange={e => setPreviewData({ ...previewData, line1: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>第二行</label>
                                <input
                                    value={previewData.line2}
                                    onChange={e => setPreviewData({ ...previewData, line2: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>统计数据</label>
                                <input
                                    value={previewData.stat}
                                    onChange={e => setPreviewData({ ...previewData, stat: e.target.value })}
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right: Program / Live Control */}
                <div className="program-section">
                    <Card className="program-card">
                        <div className="preview-header">
                            <span className="preview-label">直播输出 (PGM)</span>
                            <Badge variant={isOnAir ? 'error' : 'default'}>
                                {isOnAir ? '直播中' : '空闲'}
                            </Badge>
                        </div>
                        <div className={`preview-window program-window ${isOnAir ? 'active' : ''}`}>
                            {isOnAir ? (
                                <div className="mock-graphic">
                                    <div className="graphic-content">
                                        <h2>{previewData.line1}</h2>
                                        <p>{previewData.line2}</p>
                                        <div className="graphic-stat">{previewData.stat}</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="offline-placeholder">
                                    <Monitor size={48} />
                                    <span>无信号输出</span>
                                </div>
                            )}
                        </div>

                        <div className="control-panel">
                            <Button
                                variant="primary"
                                size="lg"
                                className="take-btn"
                                icon={Play}
                                onClick={handleTake}
                                disabled={isOnAir}
                            >
                                播出 (TAKE)
                            </Button>
                            <Button
                                variant="danger"
                                size="lg"
                                className="clear-btn"
                                icon={Square}
                                onClick={handleClear}
                                disabled={!isOnAir}
                            >
                                CLEAR
                            </Button>
                            <Button variant="secondary" icon={SkipForward}>Update</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PlayoutControl;
