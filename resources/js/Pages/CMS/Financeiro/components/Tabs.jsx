/** @jsxImportSource react */
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function FinanceiroTabs({ tabs = [], className = '' }) {
    if (!tabs?.length) {
        return null;
    }

    return (
        <div className={cn('flex flex-wrap gap-2', className)}>
            {tabs.map((tab) => {
                const isActive = Boolean(tab.active);
                const isEnabled = tab.enabled ?? true;
                const label = tab.label ?? tab.key;

                if (isEnabled || isActive) {
                    return (
                        <Button
                            key={tab.key || tab.href}
                            variant={isActive ? 'default' : 'outline'}
                            asChild
                            title={tab.tooltip || undefined}
                        >
                            <Link href={tab.href || '#'}>{label}</Link>
                        </Button>
                    );
                }

                return (
                    <Button
                        key={tab.key || tab.href}
                        variant="outline"
                        disabled
                        title={tab.tooltip || 'Acesso indisponível'}
                    >
                        <span className="opacity-70">{label}</span>
                    </Button>
                );
            })}
        </div>
    );
}
