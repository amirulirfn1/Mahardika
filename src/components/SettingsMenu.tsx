"use client";
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/lib/ThemeContext';
import { Dropdown, Form } from 'react-bootstrap';
import { supabaseClient } from '@/lib/supabaseClient';

export const SettingsMenu: React.FC = () => {
  const { i18n, t } = useTranslation();
  const { dark, toggleDark } = useTheme();
  const [saving, setSaving] = useState(false);

  const saveSettings = async (newLang: string, newDark: boolean) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (user) {
        await supabaseClient
          .from('users')
          .update({ settings: { lang: newLang, dark: newDark } })
          .eq('id', user.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLangChange = (lng: string) => {
    i18n.changeLanguage(lng);
    saveSettings(lng, dark);
  };

  const handleDarkToggle = () => {
    toggleDark();
    saveSettings(i18n.language, !dark);
  };

  return (
    <Dropdown align="end">
      <Dropdown.Toggle variant="outline-secondary" size="sm">
        {t('navbar.settings')}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Header>{t('settings.language')}</Dropdown.Header>
        <Dropdown.Item onClick={() => handleLangChange('en')}>English</Dropdown.Item>
        <Dropdown.Item onClick={() => handleLangChange('ms')}>Bahasa Melayu</Dropdown.Item>
        <Dropdown.Divider />
        <Form.Check
          type="switch"
          id="dark-switch"
          label={t('settings.dark_mode')}
          checked={dark}
          onChange={handleDarkToggle}
          disabled={saving}
          className="px-3"
        />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SettingsMenu; 