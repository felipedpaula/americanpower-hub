/** @jsxImportSource react */
import { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function CMSLayout({ children }) {
    const { post } = useForm();
    const { url, props } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const permissionLevel = props.auth?.user?.user_type?.permission_level ?? 0;

    const logout = (e) => {
        e.preventDefault();
        post('/cms/logout');
    };

    const navigation = [
        { name: 'Dashboard', href: '/cms/dashboard', icon: '📊' },
        { name: 'Turmas', href: '/cms/turmas', icon: '🎓', requiredPermission: 4 },
        { name: 'Usuários', href: '/cms/usuarios', icon: '👥', requiredPermission: 4 },
        { name: 'Relatórios', href: '/cms/relatorios', icon: '📈', disabled: true },
    ];

    const isActive = (href) => {
        if (href === '/cms/dashboard') {
            return url === href;
        }
        return url.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                        <Link href="/cms/dashboard" className="flex items-center space-x-2">
                            <span className="text-2xl">🇺🇸</span>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-900">American Power</span>
                                <span className="text-xs text-gray-500">CMS</span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isRestricted = item.requiredPermission && permissionLevel < item.requiredPermission;
                            const disabled = item.disabled || isRestricted;

                            return (
                                <Link
                                    key={item.name}
                                    href={disabled ? '#' : item.href}
                                    onClick={disabled ? (e) => e.preventDefault() : undefined}
                                    className={cn(
                                        "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                        isActive(item.href)
                                            ? "bg-primary text-primary-foreground"
                                            : disabled
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-gray-700 hover:bg-gray-100"
                                    )}
                                    aria-disabled={disabled}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span>{item.name}</span>
                                    {item.disabled && (
                                        <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                                            Em breve
                                        </span>
                                    )}
                                    {isRestricted && !item.disabled && (
                                        <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                                            Restrito
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                                {props.auth?.user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {props.auth?.user?.name || 'Usuário'}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {props.auth?.user?.email || ''}
                                </p>
                            </div>
                        </div>
                        <form onSubmit={logout}>
                            <Button type="submit" variant="outline" size="sm" className="w-full">
                                🚪 Sair
                            </Button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div
                className={cn(
                    "transition-all duration-200 ease-in-out",
                    sidebarOpen ? "ml-64" : "ml-0"
                )}
            >
                {/* Top Header */}
                <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between h-16 px-6">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>

                        <div className="flex items-center space-x-4">
                            <Button variant="outline" size="sm" asChild>
                                <a href="/" target="_blank">
                                    🌐 Ver Site
                                </a>
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
