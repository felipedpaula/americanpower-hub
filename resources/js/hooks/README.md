# Hooks Responsivos

Este arquivo contém hooks customizados para responsividade que podem ser reutilizados em qualquer componente da aplicação.

## useResponsive

Hook genérico para detectar tamanho da tela e responsividade.

```jsx
import { useResponsive } from '@/hooks/useResponsive';

function MeuComponente() {
    const { isMobile, isDesktop, screenWidth, screenHeight } = useResponsive(768);

    return (
        <div>
            {isMobile ? (
                <p>Versão Mobile</p>
            ) : (
                <p>Versão Desktop</p>
            )}
        </div>
    );
}
```

### Parâmetros
- `breakpoint` (number, opcional): Ponto de quebra em pixels (padrão: 768)

### Retorno
- `isMobile`: boolean - true se largura < breakpoint
- `isDesktop`: boolean - true se largura >= breakpoint
- `screenWidth`: number - largura atual da tela
- `screenHeight`: number - altura atual da tela
- `breakpoint`: number - valor do breakpoint usado

## useResponsiveSidebar

Hook específico para sidebars responsivas, usado no CMSLayout.

```jsx
import { useResponsiveSidebar } from '@/hooks/useResponsive';

function MinhaSidebar() {
    const { sidebarOpen, setSidebarOpen, isMobile, isDesktop, toggleSidebar } = useResponsiveSidebar(768);

    return (
        <aside className={sidebarOpen ? 'open' : 'closed'}>
            <button onClick={toggleSidebar}>
                {sidebarOpen ? 'Fechar' : 'Abrir'}
            </button>
        </aside>
    );
}
```

### Parâmetros
- `desktopBreakpoint` (number, opcional): Ponto de quebra para desktop (padrão: 768)

### Retorno
- `sidebarOpen`: boolean - estado atual da sidebar
- `setSidebarOpen`: function - função para alterar estado manualmente
- `isMobile`: boolean - true se está em mobile
- `isDesktop`: boolean - true se está em desktop
- `toggleSidebar`: function - função para alternar estado

### Comportamento Automático
- **Mobile (< 768px)**: Sidebar inicia fechada
- **Desktop (≥ 768px)**: Sidebar inicia aberta
- **Resize**: Estado se ajusta automaticamente ao redimensionar

## Exemplos de Uso

### Sidebar Básica
```jsx
const { sidebarOpen, toggleSidebar, isMobile } = useResponsiveSidebar();

return (
    <div>
        <button onClick={toggleSidebar}>Menu</button>
        {sidebarOpen && <Sidebar />}
    </div>
);
```

### Layout Condicional
```jsx
const { isMobile } = useResponsive(1024);

return (
    <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
        <Content />
    </div>
);
```

### Debug de Tamanho
```jsx
const { screenWidth, screenHeight, breakpoint } = useResponsive();

return (
    <div>
        <p>Largura: {screenWidth}px</p>
        <p>Altura: {screenHeight}px</p>
        <p>Breakpoint: {breakpoint}px</p>
    </div>
);
```