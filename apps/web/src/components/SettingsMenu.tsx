'use client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/lib/ThemeContext';
import { supabaseClient } from '@/lib/supabaseClient';

export const SettingsMenu: React.FC = () => {
  const { i18n, t } = useTranslation();
  const { dark, toggleDark } = useTheme();
  const [saving, setSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const saveSettings = async (newLang: string, newDark: boolean) => {
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
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
    setIsOpen(false);
  };

  const handleDarkToggle = () => {
    toggleDark();
    saveSettings(i18n.language, !dark);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {t('navbar.settings')}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
            <div className="py-1">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {t('settings.language')}
              </div>
              <button
                onClick={() => handleLangChange('en')}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                English
              </button>
              <button
                onClick={() => handleLangChange('ms')}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                Bahasa Melayu
              </button>
              <div className="border-t border-gray-200 my-1" />
              <div className="px-3 py-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={dark}
                    onChange={handleDarkToggle}
                    disabled={saving}
                    className="mr-2 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    {t('settings.dark_mode')}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SettingsMenu;
