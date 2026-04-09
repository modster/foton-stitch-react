import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';

export const Providers: React.FC<{ readonly children?: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      {children ?? <App />}
    </BrowserRouter>
  );
};