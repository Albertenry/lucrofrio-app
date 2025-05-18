import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FiHome, FiUsers, FiBriefcase, FiClipboard,
    FiSettings, FiLogOut, FiMenu, FiX, FiPackage
} from 'react-icons/fi';

interface MenuItem {
    path: string;
    icon: string;
    label: string;
}

interface SidebarProps {
    onLogout: () => void;
    menuItems?: MenuItem[];
}

const Sidebar = ({ onLogout, menuItems }: SidebarProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname.startsWith(path);
    };

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'home': return <FiHome size={20} />;
            case 'users': return <FiUsers size={20} />;
            case 'briefcase': return <FiBriefcase size={20} />;
            case 'clipboard': return <FiClipboard size={20} />;
            case 'settings': return <FiSettings size={20} />;
            case 'package': return <FiPackage size={20} />;
            default: return <FiHome size={20} />;
        }
    };

    const defaultMenuItems = [
        { path: '/admin/dashboard', icon: 'home', label: 'Dashboard' },
        { path: '/admin/empresas', icon: 'briefcase', label: 'Empresas' },
        { path: '/admin/usuarios', icon: 'users', label: 'Usuários' },
        { path: '/admin/ordens', icon: 'clipboard', label: 'Ordens de Serviço' },
        { path: '/admin/configuracoes', icon: 'settings', label: 'Configurações' },
    ];

    const items = menuItems || defaultMenuItems;

    return (
        <>
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-2 rounded-md bg-primary text-white"
                >
                    {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Overlay for mobile */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-40 bg-white shadow-lg transition-all duration-300 
                   ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
                   lg:translate-x-0 lg:z-30
                   ${collapsed ? 'w-20' : 'w-64'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className={`flex items-center justify-between p-4 border-b ${collapsed ? 'justify-center' : ''}`}>
                        {!collapsed && (
                            <div className="flex items-center">
                                <span className="text-primary font-bold text-xl">Lucrofrio</span>
                                <span className="ml-2 text-gray-700 font-medium">Manager</span>
                            </div>
                        )}

                        {collapsed && (
                            <div className="flex items-center justify-center">
                                <span className="text-primary font-bold text-xl">L</span>
                            </div>
                        )}

                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="text-gray-500 hover:text-primary lg:block hidden"
                        >
                            {collapsed ? <FiMenu size={20} /> : <FiX size={20} />}
                        </button>
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 py-4 overflow-y-auto">
                        <ul className="space-y-2 px-3">
                            {items.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center p-3 rounded-lg transition-colors
                              ${isActive(item.path)
                                                ? 'bg-primary text-white'
                                                : 'text-gray-700 hover:bg-gray-100'}`}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <span className="flex-shrink-0">{getIcon(item.icon)}</span>
                                        {!collapsed && <span className="ml-3">{item.label}</span>}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Logout */}
                    <div className="p-4 border-t">
                        <button
                            onClick={onLogout}
                            className={`flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full transition-colors`}
                        >
                            <span className="flex-shrink-0"><FiLogOut size={20} /></span>
                            {!collapsed && <span className="ml-3">Sair</span>}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
