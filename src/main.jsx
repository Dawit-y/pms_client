import { StrictMode } from 'react';

if (import.meta.env.VITE_NODE_ENV === 'production') {
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = { isDisabled: true };
}
if (import.meta.env.VITE_NODE_ENV !== 'production') {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/react-scan/dist/auto.global.js';
  document.head.appendChild(script);
}
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App.jsx';
import QueryProvider from './QueryProvider.jsx';
import './index.css';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css';

import './assets/scss/theme.scss';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DndProvider backend={HTML5Backend}>
      <Provider store={store}>
        <QueryProvider>
          <App />
        </QueryProvider>
      </Provider>
    </DndProvider>
  </StrictMode>
);
