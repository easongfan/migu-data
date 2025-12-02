import React, { useContext } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { UserContext } from '../App';
import {
    LayoutDashboard,
    Workflow,
    Database,
    Server,
    MonitorPlay,
    Settings,
    Bell,
    User,
    Shield,
    LineChart,
    BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import './AppShell.css';

const navItems = [
    { path: '/ingestion', icon: LayoutDashboard, label: '数据接入' },
    { path: '/processing', icon: Workflow, label: '可视化处理' },
    { path: '/modeling', icon: Database, label: '数据建模' },
    { path: '/analysis', icon: LineChart, label: '数据分析' },
    { path: '/reference', icon: BookOpen, label: '公共代码' },
    { path: '/api', icon: Server, label: 'API 管理' },
    { path: '/security', icon: Shield, label: '安全中心' },
    { path: '/playout', icon: MonitorPlay, label: '播控中心' },
];

const AppShell = () => {
    const location = useLocation();
    const { userRole, setUserRole } = useContext(UserContext);

    return (
        <div className="app-shell">
            {/* ... existing sidebar */}
            <aside className="sidebar glass-panel">
                <div className="sidebar-header">
                    {/* <div className="logo-icon">M</div>
                    <span className="logo-text">咪咕数据中台</span> */}
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="nav-indicator"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <item.icon size={20} className="nav-icon" />
                                <span className="nav-label">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <button className="icon-btn">
                        <Settings size={20} />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-header glass-panel">
                    <h1 className="page-title">
                        {navItems.find(i => location.pathname.startsWith(i.path))?.label || '仪表盘'}
                    </h1>
                    <div className="header-actions">
                        <button className="icon-btn">
                            <Bell size={20} />
                            <span className="badge">3</span>
                        </button>

                        <div className="role-switcher">
                            <button
                                className={`role-btn ${userRole === 'admin' ? 'active' : ''}`}
                                onClick={() => setUserRole('admin')}
                            >
                                管理员
                            </button>
                            <button
                                className={`role-btn ${userRole === 'user' ? 'active' : ''}`}
                                onClick={() => setUserRole('user')}
                            >
                                普通用户
                            </button>
                        </div>

                        <div className="user-profile">
                            <div className={`avatar ${userRole === 'admin' ? 'bg-primary' : 'bg-secondary'}`}>
                                {userRole === 'admin' ? <Shield size={16} /> : <User size={16} />}
                            </div>
                            <span className="username">
                                {userRole === 'admin' ? '系统管理员' : '数据操作员'}
                            </span>
                        </div>
                    </div>
                </header>

                <div className="content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AppShell;
