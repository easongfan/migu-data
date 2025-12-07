import React, { useState } from 'react';
import { Shield, Check, Plus, Edit, Trash2, Users } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

const MOCK_ROLES = [
    {
        id: 1,
        name: '系统管理员',
        description: '系统完全控制权限',
        users: 3,
        permissions: ['all']
    },
    {
        id: 2,
        name: '操作员',
        description: '日常运营操作权限',
        users: 12,
        permissions: ['ingestion.read', 'ingestion.write', 'processing.read', 'processing.write', 'api.read']
    },
    {
        id: 3,
        name: '普通用户',
        description: '只读访问权限',
        users: 45,
        permissions: ['ingestion.read', 'processing.read', 'api.read', 'analysis.read']
    },
];

const PERMISSION_TREE = [
    {
        id: 'ingestion',
        name: '数据接入',
        children: [
            { id: 'ingestion.read', name: '查看源数据' },
            { id: 'ingestion.write', name: '配置数据源' },
            { id: 'ingestion.delete', name: '删除数据源' }
        ]
    },
    {
        id: 'processing',
        name: '可视化处理',
        children: [
            { id: 'processing.read', name: '查看流程' },
            { id: 'processing.write', name: '编辑流程' },
            { id: 'processing.execute', name: '执行流程' }
        ]
    },
    {
        id: 'system',
        name: '系统管理',
        children: [
            { id: 'system.users', name: '用户管理' },
            { id: 'system.roles', name: '角色管理' },
            { id: 'system.config', name: '系统配置' }
        ]
    }
];

const RoleList = () => {
    const [roles, setRoles] = useState(MOCK_ROLES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [selectedPerms, setSelectedPerms] = useState([]);

    const handleEdit = (role) => {
        setEditingRole(role);
        setSelectedPerms(role.permissions.includes('all')
            ? PERMISSION_TREE.flatMap(g => g.children.map(c => c.id))
            : role.permissions
        );
        setIsModalOpen(true);
    };

    const handlePermToggle = (permId) => {
        if (selectedPerms.includes(permId)) {
            setSelectedPerms(selectedPerms.filter(p => p !== permId));
        } else {
            setSelectedPerms([...selectedPerms, permId]);
        }
    };

    const handleSaveRole = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newRole = {
            id: editingRole ? editingRole.id : Date.now(),
            name: formData.get('name'),
            description: formData.get('description'),
            users: editingRole ? editingRole.users : 0,
            permissions: selectedPerms
        };

        if (editingRole) {
            setRoles(roles.map(r => r.id === editingRole.id ? newRole : r));
        } else {
            setRoles([...roles, newRole]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="role-list">
            <div className="flex justify-between items-center mb-6">
                <div className="text-secondary text-sm">共 {roles.length} 个角色定义</div>
                <Button icon={Plus} onClick={() => { setEditingRole(null); setSelectedPerms([]); setIsModalOpen(true); }}>创建角色</Button>
            </div>

            <div className="role-grid">
                {roles.map(role => (
                    <Card key={role.id} className="h-full flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${role.name === '系统管理员' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{role.name}</h3>
                                    <p className="text-xs text-secondary flex items-center gap-1 mt-1">
                                        <Users size={12} /> {role.users} 个用户
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <Button size="sm" variant="ghost" icon={Edit} onClick={() => handleEdit(role)} />
                            </div>
                        </div>

                        <p className="text-sm text-secondary mb-6 flex-1">{role.description}</p>

                        <div className="border-t border-border pt-4 mt-auto">
                            <div className="text-xs font-semibold text-muted mb-2 uppercase">权限概览</div>
                            <div className="flex flex-wrap gap-2">
                                {role.permissions.includes('all') ? (
                                    <Badge variant="primary">全部权限</Badge>
                                ) : (
                                    role.permissions.slice(0, 3).map(p => {
                                        const module = p.split('.')[0];
                                        const labels = {
                                            ingestion: '数据接入',
                                            processing: '可视化处理',
                                            api: 'API管理',
                                            analysis: '智能分析',
                                            system: '系统管理'
                                        };
                                        return (
                                            <Badge key={p} variant="secondary">{labels[module] || module}</Badge>
                                        );
                                    })
                                )}
                                {!role.permissions.includes('all') && role.permissions.length > 3 && (
                                    <Badge variant="secondary">+{role.permissions.length - 3}</Badge>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingRole ? '编辑角色权限' : '创建新角色'}
            >
                <form onSubmit={handleSaveRole} className="flex flex-col gap-4">
                    <div className="form-group">
                        <label>角色名称</label>
                        <input name="name" className="form-input" defaultValue={editingRole?.name} required />
                    </div>
                    <div className="form-group">
                        <label>描述</label>
                        <textarea name="description" className="form-input" rows="2" defaultValue={editingRole?.description} />
                    </div>

                    <div className="form-group">
                        <label className="mb-2 block">权限配置</label>
                        <div className="permission-tree bg-surface">
                            {PERMISSION_TREE.map(group => (
                                <div key={group.id} className="perm-group">
                                    <div className="perm-group-header">
                                        <Shield size={14} /> {group.name}
                                    </div>
                                    <div className="pl-6 grid grid-cols-2 gap-2">
                                        {group.children.map(perm => (
                                            <label key={perm.id} className="perm-item cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="accent-primary mr-2"
                                                    checked={selectedPerms.includes(perm.id)}
                                                    onChange={() => handlePermToggle(perm.id)}
                                                />
                                                {perm.name}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>取消</Button>
                        <Button type="submit">保存配置</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default RoleList;
