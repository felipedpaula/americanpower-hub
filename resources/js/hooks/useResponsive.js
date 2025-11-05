import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar tamanho da tela e responsividade
 * @param {number} breakpoint - Ponto de quebra em pixels (padrão: 768)
 * @returns {object} - { isMobile, isDesktop, screenWidth, screenHeight }
 */
export function useResponsive(breakpoint = 768) {
    const [screenSize, setScreenSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1024,
        height: typeof window !== 'undefined' ? window.innerHeight : 768,
    });

    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        // Verificar tamanho inicial
        handleResize();

        // Adicionar listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        isMobile: screenSize.width < breakpoint,
        isDesktop: screenSize.width >= breakpoint,
        screenWidth: screenSize.width,
        screenHeight: screenSize.height,
        breakpoint,
    };
}

/**
 * Hook específico para sidebar responsiva
 * @param {number} desktopBreakpoint - Ponto de quebra para desktop (padrão: 768)
 * @returns {object} - { sidebarOpen, setSidebarOpen, isMobile, isDesktop, toggleSidebar }
 */
export function useResponsiveSidebar(desktopBreakpoint = 768) {
    const { isMobile, isDesktop } = useResponsive(desktopBreakpoint);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Atualizar estado da sidebar baseado no tamanho da tela
    useEffect(() => {
        if (isMobile) {
            setSidebarOpen(false); // Fechar em mobile
        } else {
            setSidebarOpen(true); // Abrir em desktop
        }
    }, [isMobile, isDesktop]);

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    return {
        sidebarOpen,
        setSidebarOpen,
        isMobile,
        isDesktop,
        toggleSidebar,
    };
}