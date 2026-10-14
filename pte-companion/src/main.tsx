import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ProgressProvider } from './state/ProgressContext';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ProgressProvider>
      <App />
    </ProgressProvider>
  </React.StrictMode>,
);
