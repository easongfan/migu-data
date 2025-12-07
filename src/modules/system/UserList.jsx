import React, { useState } from 'react';
import { User, Edit, Trash2, Shield, Search, Plus, Filter } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

const MOCK_USERS = [
    { id: 1, name: '管理员', email: 'admin@migu.cn', role: '系统管理员', status: 'active', lastLogin: '2023-11-01 10:23' },
    { id: 2, name: '张三', email: 'zhangsan@migu.cn', role: '操作员', status: 'active', lastLogin: '2023-11-02 09:15' },
    { id: 3, name: '李四', email: 'lisi@migu.cn', role: '普通用户', status: 'inactive', lastLogin: '2023-10-25 14:00' },
    { id: 4, name: '开发者', email: 'dev@migu.cn', role: '开发者', status: 'active', lastLogin: '2023-11-02 11:30' },
];

const UserList = () => {
    const [users, setUsers] = useState(MOCK_USERS);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id) => {
        if (window.confirm('确定要删除该用户吗？')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const handleSaveUser = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newUser = {
            id: editingUser ? editingUser.id : Date.now(),
            name: formData.get('name'),
            email: formData.get('email'),
            role: formData.get('role'),
            status: formData.get('status'),
            lastLogin: editingUser ? editingUser.lastLogin : '-'
        };

        if (editingUser) {
            setUsers(users.map(u => u.id === editingUser.id ? newUser : u));
        } else {
            setUsers([...users, newUser]);
        }
        setIsModalOpen(false);
        setEditingUser(null);
    };

    return (
        <div className="user-list">
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                        <input
                            className="form-input pl-10 w-full"
                            placeholder="搜索用户姓名或邮箱..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="secondary" icon={Filter}>筛选</Button>
                </div>
                <Button icon={Plus} onClick={() => { setEditingUser(null); setIsModalOpen(true); }}>添加用户</Button>
            </div>

            <Card className="overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="w-16">头像</th>
                            <th>姓名</th>
                            <th>邮箱</th>
                            <th>角色</th>
                            <th>状态</th>
                            <th>最后登录</th>
                            <th className="text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-avatar text-white bg-gradient-to-br from-blue-500 to-purple-600">
                                        {user.name[0]}
                                    </div>
                                </td>
                                <td className="font-medium text-primary">{user.name}</td>
                                <td className="text-secondary">{user.email}</td>
                                <td>
                                    <Badge variant={user.role === '系统管理员' ? 'primary' : 'secondary'}>
                                        <Shield size={12} className="mr-1" />
                                        {user.role}
                                    </Badge>
                                </td>
                                <td>
                                    <span className={`status-badge ${user.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        {user.status === 'active' ? '活跃' : '停用'}
                                    </span>
                                </td>
                                <td className="text-secondary text-sm">{user.lastLogin}</td>
                                <td className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button size="sm" variant="ghost" icon={Edit} onClick={() => { setEditingUser(user); setIsModalOpen(true); }} />
                                        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" icon={Trash2} onClick={() => handleDelete(user.id)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser ? '编辑用户' : '添加新用户'}
            >
                <form onSubmit={handleSaveUser} className="flex flex-col gap-4">
                    <div className="form-group">
                        <label>姓名</label>
                        <input name="name" className="form-input" defaultValue={editingUser?.name} required />
                    </div>
                    <div className="form-group">
                        <label>邮箱</label>
                        <input name="email" type="email" className="form-input" defaultValue={editingUser?.email} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label>角色</label>
                            <select name="role" className="form-select" defaultValue={editingUser?.role || '操作员'}>
                                <option value="系统管理员">系统管理员</option>
                                <option value="操作员">操作员</option>
                                <option value="普通用户">普通用户</option>
                                <option value="开发者">开发者</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>状态</label>
                            <select name="status" className="form-select" defaultValue={editingUser?.status || 'active'}>
                                <option value="active">活跃</option>
                                <option value="inactive">停用</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>取消</Button>
                        <Button type="submit">保存</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UserList;
