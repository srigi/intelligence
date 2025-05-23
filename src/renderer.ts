import { Provider as ToastProvider } from '@radix-ui/react-toast';
import React from 'react';
import { jsx as _jsx } from 'react/jsx-runtime';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './index.css';

createRoot(document.body).render(
  _jsx(React.StrictMode, {
    children: _jsx(ToastProvider, {
      children: _jsx(App, {}),
    }),
  }),
);
