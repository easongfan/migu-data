import React, { useState } from 'react';
import { Users, Shield, Key } from 'lucide-react';
import UserList from './UserList';
import RoleList from './RoleList';
import './System.css';

const SystemDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');

    return (
        <div className="system-dashboard fade-in">
            <div className="system-tabs">
                <button
                    className={`system-tab ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    <Users size={18} />
                    <span>用户管理</span>
                </button>
                <button
                    className={`system-tab ${activeTab === 'roles' ? 'active' : ''}`}
                    onClick={() => setActiveTab('roles')}
                >
                    <Shield size={18} />
                    <span>角色管理</span>
                </button>
                {/* <button 
                    className={`system-tab ${activeTab === 'permissions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('permissions')}
                >
                    <Key size={18} />
                    <span>权限资源</span>
                </button> */}
            </div>

            <div className="system-content">
                {activeTab === 'users' && <UserList />}
                {activeTab === 'roles' && <RoleList />}
                {activeTab === 'permissions' && (
                    <div className="p-8 text-center text-secondary">
                        <Key size={48} className="mx-auto mb-4 opacity-50" />
                        <h3>权限资源视图开发中...</h3>
                        <p>Permission Resource View is under construction</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SystemDashboard;
