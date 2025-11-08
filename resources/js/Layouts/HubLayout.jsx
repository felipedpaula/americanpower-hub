/** @jsxImportSource react */
import { Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useResponsiveSidebar } from '@/hooks/useResponsive';
import { useHubTheme } from '@/hooks/useTheme';

export default function HubLayout({ children }) {
    const { post } = useForm();
    const { url, props } = usePage();
    const { sidebarOpen, setSidebarOpen, isMobile, toggleSidebar } = useResponsiveSidebar();
    const { theme, toggleTheme } = useHubTheme();

    // Pega o tipo de usuário do objeto user da página ou do auth compartilhado
    const userType = props.user?.type || props.auth?.user?.user_type?.name || 'aluno';

    const logout = (e) => {
        e.preventDefault();
        post('/hub/logout');
    };

    // Navegação adaptada por tipo de usuário
    const getNavigation = () => {
        const baseNav = [
            { name: 'Dashboard', href: '/hub/dashboard', icon: '📊' },
        ];

        const navByType = {
            root: [
                ...baseNav,
                { name: 'Turmas', href: '/hub/turmas', icon: '🎓' },
                { name: 'Atividades', href: '/hub/atividades', icon: '📝' },
            ],
            admin: [
                ...baseNav,
                { name: 'Turmas', href: '/hub/turmas', icon: '🎓' },
                { name: 'Atividades', href: '/hub/atividades', icon: '📝' },
            ],
            professor: [
                ...baseNav,
                { name: 'Minhas Turmas', href: '/hub/turmas', icon: '🎓' },
                { name: 'Atividades', href: '/hub/atividades', icon: '📝' },
            ],
            aluno: [
                ...baseNav,
                { name: 'Minhas Turmas', href: '/hub/turmas', icon: '🎓' },
                { name: 'Atividades', href: '/hub/atividades', icon: '📝' },
                { name: 'Minhas Notas', href: '/hub/notas', icon: '📊' },
            ],
        };

        return navByType[userType] || baseNav;
    };

    const navigation = getNavigation();

    const isActive = (href) => {
        if (href === '/hub/dashboard') {
            return url === href;
        }
        return url.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Overlay Mobile */}
            {sidebarOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black/50 z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border shadow-lg transform transition-all duration-300 ease-in-out",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <h1 className="text-xl font-bold text-foreground">
                            American Power Hub
                        </h1>
                        {isMobile && (
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-2 text-muted-foreground hover:text-foreground transition-all duration-200"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="p-4 border-b border-border bg-muted">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-semibold">
                                    {props.auth?.user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {props.auth?.user?.name}
                                </p>
                                <p className="text-xs text-muted-foreground capitalize">
                                    {userType}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200",
                                    isActive(item.href)
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-foreground hover:bg-accent hover:text-accent-foreground",
                                    item.disabled && "opacity-50 cursor-not-allowed"
                                )}
                                onClick={(e) => {
                                    if (item.disabled) e.preventDefault();
                                    if (isMobile) setSidebarOpen(false);
                                }}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="text-sm font-medium">{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-border space-y-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleTheme}
                            className="w-full justify-start"
                        >
                            <span className="mr-2">{theme === 'dark' ? '🌙' : '☀️'}</span>
                            {theme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={logout}
                            className="w-full justify-start text-destructive hover:text-destructive"
                        >
                            <span className="mr-2">🚪</span>
                            Sair
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className={cn(
                "transition-all duration-300 ease-in-out",
                sidebarOpen ? "lg:ml-64" : "ml-0"
            )}>
                {/* Top Bar */}
                <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
                    <div className="flex items-center justify-between px-4 py-3">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                        >
                            <span className="text-xl">☰</span>
                        </button>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-muted-foreground">
                                {props.auth?.user?.name}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6 bg-background min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
}
