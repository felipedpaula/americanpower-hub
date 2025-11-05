/** @jsxImportSource react */
import { Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useResponsiveSidebar } from '@/hooks/useResponsive';
import { useTheme } from '@/hooks/useTheme';

export default function CMSLayout({ children }) {
    const { post } = useForm();
    const { url, props } = usePage();
    const { sidebarOpen, setSidebarOpen, isMobile, toggleSidebar } = useResponsiveSidebar();
    const { theme, toggleTheme } = useTheme();

    const permissionLevel = props.auth?.user?.user_type?.permission_level ?? 0;

    const logout = (e) => {
        e.preventDefault();
        post('/cms/logout');
    };

    const navigation = [
        { name: 'Dashboard', href: '/cms/dashboard', icon: '📊' },
        { name: 'Turmas', href: '/cms/turmas', icon: '🎓', requiredPermission: 4 },
        { name: 'Usuários', href: '/cms/usuarios', icon: '👥', requiredPermission: 4 },
        { name: 'Configurações', href: '/cms/configuracoes', icon: '⚙️', requiredPermission: 4 },
        { name: 'Relatórios', href: '/cms/relatorios', icon: '📈', disabled: true },
    ];

    const isActive = (href) => {
        if (href === '/cms/dashboard') {
            return url === href;
        }
        return url.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-background dark:bg-background">
            {/* Overlay Mobile */}
            {sidebarOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black/20 z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-card dark:bg-card border-r border-border dark:border-border shadow-md transform transition-smooth",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Header */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-border dark:border-border">
                        <Link href="/cms/dashboard" className="flex items-center space-x-2">
                            <span className="text-2xl">🇺🇸</span>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-foreground dark:text-foreground">American Power</span>
                                <span className="text-xs text-muted-foreground dark:text-muted-foreground">CMS</span>
                            </div>
                        </Link>
                        {/* Close Button Mobile */}
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className={cn(
                                "p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary dark:hover:bg-secondary transition-smooth",
                                isMobile ? "block" : "hidden"
                            )}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
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
                                            ? "text-muted-foreground cursor-not-allowed"
                                            : "text-foreground hover:bg-secondary dark:hover:bg-secondary"
                                    )}
                                    aria-disabled={disabled}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span>{item.name}</span>
                                    {item.disabled && (
                                        <span className="ml-auto text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded">
                                            Em breve
                                        </span>
                                    )}
                                    {isRestricted && !item.disabled && (
                                        <span className="ml-auto text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded">
                                            Restrito
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-border dark:border-border transition-smooth">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-sm">
                                {props.auth?.user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {props.auth?.user?.name || 'Usuário'}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
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
                    !isMobile && sidebarOpen ? "md:ml-64" : "ml-0"
                )}
            >
                {/* Top Header */}
                <header className="sticky top-0 z-40 bg-card dark:bg-card border-b border-border dark:border-border shadow-sm transition-smooth">
                    <div className="flex items-center justify-between h-16 px-6">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary dark:hover:bg-secondary transition-smooth"
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
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={toggleTheme}
                                title={`Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
                            >
                                {theme === 'dark' ? '☀️' : '🌙'}
                            </Button>
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
