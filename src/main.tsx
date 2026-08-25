import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LanguageProvider from '@/content/LanguageProvider'

// Set before React renders, so scroll-reveal starts hidden without a flash.
// Without JavaScript the class is never added and all content stays visible.
document.documentElement.classList.add('js')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
