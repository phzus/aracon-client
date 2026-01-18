import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// Mount the widget to the #aracon-imoveis-widget div
const container = document.getElementById('aracon-imoveis-widget');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  console.error('Widget container #aracon-imoveis-widget not found. Please add <div id="aracon-imoveis-widget"></div> to your HTML.');
}

