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
    `text-sm font-medium transition-colors ${isActive ? 'text-[#0A0A0A] font-semibold' : 'text-[#6B7280] hover:text-[#0A0A0A]'}`;

  return (
    <nav className="bg-[#FAFAFA] border-b border-[#E8E8E8] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-[#0A0A0A]">
            <span className="brand-mark" aria-hidden="true"><Shield size={26} strokeWidth={1.75} /></span>
            <span className="brand-wordmark text-lg font-bold tracking-tight"><span>Scheme</span><strong>Saathi</strong></span>
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
            <div className="flex items-center gap-1 border border-[#E5E5E5] bg-[#F3F3F3] rounded-full p-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLangChange(lang.code)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                    i18n.language === lang.code
                      ? 'lang-btn-active bg-[#0A0A0A] text-white shadow-sm'
                      : 'lang-btn-inactive text-[#6B7280] hover:text-[#0A0A0A]'
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
                  className="text-sm font-medium text-[#6B7280] hover:text-[#0A0A0A] transition-colors"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>{t('nav.login')}</NavLink>
                <Link
                  to="/register"
                  className="nav-register-btn bg-[#0A0A0A] hover:bg-black text-white text-sm font-medium px-4 py-2 rounded-full transition-colors shadow-sm inline-flex items-center"
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
