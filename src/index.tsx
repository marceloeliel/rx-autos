import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registra o service worker para habilitar o PWA
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log('Service Worker registrado com sucesso!');
  },
  onUpdate: () => {
    console.log('Nova versão do Service Worker disponível!');
  }
});
