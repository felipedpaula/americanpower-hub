import './bootstrap';
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'

// Aplicar tema escuro por padrão
if (typeof window !== 'undefined') {
  const theme = localStorage.getItem('theme') || 'dark';
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
  }
}

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
    return pages[`./Pages/${name}.jsx`]
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
})

