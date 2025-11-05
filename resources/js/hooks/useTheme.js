import { useEffect, useState } from 'react';

export function useTheme(storageKey = 'theme') {
  const [theme, setTheme] = useState(() => {
    // Verificar localStorage ou preferência do sistema
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored) return stored;
      
      // Verificar preferência do sistema
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; // padrão
  });

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme };
}

// Hook específico para o CMS
export function useCMSTheme() {
  return useTheme('cms-theme');
}

// Hook específico para o Hub
export function useHubTheme() {
  return useTheme('hub-theme');
}
