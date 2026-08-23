import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import i18n from '../i18n';
import { Shield } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'HI' },
  { code: 'te', label: 'TE' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLangChange(code) {
    i18n.changeLanguage(code);
    localStorage.setItem('schemesaathi_lang', code);
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="brand-mark" aria-hidden="true"><Shield size={29} strokeWidth={1.5} /></span>
            <span className="brand-wordmark"><span>Scheme</span><strong>Saathi</strong></span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={linkClass}>{t('nav.home')}</NavLink>
            <NavLink to="/about" className={linkClass}>{t('nav.about')}</NavLink>
            <NavLink to="/services" className={linkClass}>{t('nav.services')}</NavLink>
            <NavLink to="/schemes" className={linkClass}>{t('nav.schemes')}</NavLink>
            <NavLink to="/eligibility" className={linkClass}>{t('nav.eligibility')}</NavLink>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLangChange(lang.code)}
                  className={`text-xs font-medium px-1.5 py-0.5 rounded transition-colors ${
                    i18n.language === lang.code
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 hover:text-orange-500'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {user ? (
              <>
                <NavLink to="/profile" className={linkClass}>{user.name}</NavLink>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>{t('nav.login')}</NavLink>
                <Link
                  to="/register"
                  className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
