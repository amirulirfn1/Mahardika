"use client";
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { ThemeProvider } from '@/lib/ThemeContext';

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <ThemeProvider>{children}</ThemeProvider>
  </I18nextProvider>
);

export default Providers; 