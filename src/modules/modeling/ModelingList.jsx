import React, { useState, useRef, useContext } from 'react';
import { Plus, FileJson, Edit, Trash2, Search, Copy, Filter, Eye, Download, Upload } from 'lucide-react';
import { UserContext } from '../../App';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import ModelEditor from './ModelEditor';
import ModelPreview from './ModelPreview';
import './ModelingList.css';

const MOCK_MODELS = [
    {
        id: 1,
        name: '球员统计',
        description: '标准球员表现指标',
        type: '结果数据 (Result)',
        fields: [
            { name: 'player_id', type: 'String', required: true },
            { name: 'match_id', type: 'String', required: true },
            { name: 'goals', type: 'Number', required: false },
            { name: 'assists', type: 'Number', required: false },
            { name: 'minutes_played', type: 'Number', required: true },
            { name: 'pass_accuracy', type: 'Number', required: false },
        ],
        lastModified: '2小时前'
    },
    {
        id: 2,
        name: '球队排名',
        description: '联赛积分榜和排名',
        type: '结果数据 (Result)',
        fields: [
            { name: 'team_id', type: 'String', required: true },
            { name: 'rank', type: 'Number', required: true },
            { name: 'points', type: 'Number', required: true },
            { name: 'wins', type: 'Number', required: true },
            { name: 'losses', type: 'Number', required: true },
            { name: 'draws', type: 'Number', required: true },
        ],
        lastModified: '1天前'
    },
    {
        id: 3,
        name: '比赛事件',
        description: '实时事件流架构',
        type: '状态数据 (Status)',
        fields: [
            { name: 'event_id', type: 'String', required: true },
            { name: 'timestamp', type: 'Date', required: true },
            { name: 'type', type: 'String', required: true },
            { name: 'metadata', type: 'Object', required: false },
        ],
        lastModified: '3天前'
    },
    {
        id: 4,
        name: '天气状况',
        description: '场馆环境数据',
        type: '状态数据 (Status)',
        fields: [
            { name: 'temperature', type: 'Number', required: true },
            { name: 'humidity', type: 'Number', required: true },
            { name: 'condition', type: 'String', required: true },
            { name: 'wind_speed', type: 'Number', required: false },
        ],
        lastModified: '1周前'
    },
    {
        id: 5,
        name: '球员追踪 (Player Tracking)',
        description: '高频位置与姿态数据',
        type: '高阶数据 (Advanced)',
        fields: [
            { name: 'player_id', type: 'String', required: true },
            { name: 'timestamp', type: 'Number', required: true },
            { name: 'x_pos', type: 'Number', required: true },
            { name: 'y_pos', type: 'Number', required: true },
            { name: 'speed', type: 'Number', required: false },
            { name: 'heart_rate', type: 'Number', required: false },
        ],
        lastModified: '刚刚'
    },
    {
        id: 6,
        name: '球体轨迹 (Ball Trajectory)',
        description: '3D 空间坐标与物理属性',
        type: '高阶数据 (Advanced)',
        fields: [
            { name: 'match_id', type: 'String', required: true },
            { name: 'timestamp', type: 'Number', required: true },
            { name: 'x', type: 'Number', required: true },
            { name: 'y', type: 'Number', required: true },
            { name: 'z', type: 'Number', required: true },
            { name: 'spin_rate', type: 'Number', required: false },
        ],
        lastModified: '刚刚'
    },
];

const ModelingList = () => {
    const { userRole } = useContext(UserContext);
    const [models, setModels] = useState(MOCK_MODELS);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewModel, setPreviewModel] = useState(null);
    const fileInputRef = useRef(null);

    const handleSaveModel = (modelData) => {
        const newModel = {
            id: Date.now(),
            name: modelData.name,
            description: modelData.description,
            type: modelData.type,
            fields: modelData.fields,
            lastModified: '刚刚'
        };
        setModels([newModel, ...models]);
        setIsModalOpen(false);
    };

    const handleDuplicateModel = (model) => {
        const newModel = {
            ...model,
            id: Date.now(),
            name: `${model.name} (副本)`,
            lastModified: '刚刚'
        };
        setModels([newModel, ...models]);
    };

    const handleExportModel = (model) => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(model, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${model.name}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedModel = JSON.parse(e.target.result);
                // Basic validation
                if (!importedModel.name || !importedModel.fields) {
                    alert('无效的模型文件格式');
                    return;
                }
                const newModel = {
                    ...importedModel,
                    id: Date.now(),
                    name: `${importedModel.name} (导入)`,
                    lastModified: '刚刚'
                };
                setModels(prev => [newModel, ...prev]);
            } catch (error) {
                console.error('Import error:', error);
                alert('导入失败：文件格式错误');
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset input
    };

    const filteredModels = models.filter(model => {
        const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'All' || model.type.includes(filterType);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="modeling-module fade-in">
            <div className="modeling-header">
                <div className="search-bar">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="搜索模型..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-dropdown">
                    <Filter size={16} className="filter-icon" />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="filter-select"
                    >
                        <option value="All">所有类型</option>
                        <option value="Status">状态数据</option>
                        <option value="Result">结果数据</option>
                        <option value="Advanced">高阶数据</option>
                    </select>
                </div>

                <div className="header-actions flex gap-2 ml-auto">
                    {userRole === 'admin' && (
                        <>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept=".json"
                                onChange={handleFileChange}
                            />
                            <Button variant="secondary" icon={Upload} onClick={handleImportClick}>导入模型</Button>
                            <Button icon={Plus} onClick={() => setIsModalOpen(true)}>创建模型</Button>
                        </>
                    )}
                </div>
            </div>

            <div className="models-grid">
                {filteredModels.map(model => (
                    <Card key={model.id} className="model-card">
                        <div className="model-icon">
                            <FileJson size={24} />
                        </div>
                        <div className="model-info">
                            <div className="flex justify-between items-start">
                                <h3 className="model-name">{model.name}</h3>
                                <Badge variant={model.type.includes('Status') ? 'warning' : 'success'} className="text-xs scale-90 origin-right">
                                    {model.type.split(' ')[0]}
                                </Badge>
                            </div>
                            <p className="model-desc">{model.description}</p>
                            <div className="model-meta">
                                <Badge variant="default">{model.fields.length} 字段</Badge>
                                <span className="meta-text">更新于 {model.lastModified}</span>
                            </div>
                        </div>
                        <div className="model-actions">
                            <Button size="sm" variant="secondary" icon={Eye} onClick={() => setPreviewModel(model)}>预览</Button>
                            <Button size="sm" variant="ghost" icon={Download} onClick={() => handleExportModel(model)}>导出</Button>

                            {userRole === 'admin' && (
                                <>
                                    <Button size="sm" variant="ghost" icon={Edit}>编辑</Button>
                                    <Button size="sm" variant="ghost" icon={Copy} onClick={() => handleDuplicateModel(model)}>复制</Button>
                                    <Button size="sm" variant="ghost" className="text-error" icon={Trash2}>删除</Button>
                                </>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Create Model Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="创建数据模型"
                className="wide-modal"
            >
                <ModelEditor
                    onSave={handleSaveModel}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>

            {/* Preview Model Modal */}
            <Modal
                isOpen={!!previewModel}
                onClose={() => setPreviewModel(null)}
                title="模型预览"
                className="wide-modal"
            >
                <ModelPreview
                    model={previewModel}
                    onClose={() => setPreviewModel(null)}
                />
            </Modal>
        </div>
    );
};

export default ModelingList;
