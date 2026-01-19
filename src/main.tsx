import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import styles from './index.css?inline'

// Inject Google Fonts into document head (outside Shadow DOM)
// This ensures fonts are available globally for the Shadow DOM to use
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap';
if (!document.head.querySelector('link[href*="Playfair+Display"]')) {
  document.head.appendChild(fontLink);
}

// Find the widget container
const container = document.getElementById('aracon-imoveis-widget');

if (container) {
  // Create Shadow DOM
  const shadow = container.attachShadow({ mode: 'open' });

  // Inject styles
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  shadow.appendChild(styleElement);

  // Create mount point inside Shadow DOM
  const rootElement = document.createElement('div');
  rootElement.id = 'widget-root';
  shadow.appendChild(rootElement);

  // Mount React App
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  console.error('Widget container #aracon-imoveis-widget not found. Please add <div id="aracon-imoveis-widget"></div> to your HTML.');
}

