import './index.css' with { type: 'css' };
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { Providers } from './app/providers';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers />
  </StrictMode>,
);