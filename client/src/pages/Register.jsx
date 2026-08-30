import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/register', form);
      login(data.token, data.user);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.error || t('common.error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('auth.register_title')}</h1>
        {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1">{t('auth.name')}</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
              className="w-full border border-[#E5E5E5] bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1">{t('auth.email')}</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
              className="w-full border border-[#E5E5E5] bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1">{t('auth.password')}</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6}
              className="w-full border border-[#E5E5E5] bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#0A0A0A] hover:bg-black disabled:bg-gray-300 text-white py-2.5 rounded-full font-medium text-sm transition-colors shadow-sm">
            {loading ? t('common.loading') : t('auth.register_btn')}
          </button>
        </form>

        {/* Privacy Note */}
        <div className="bg-[#F3F3F3] border border-[#E5E5E5] p-3 text-xs text-[#0A0A0A] rounded-xl mt-5 flex items-center gap-2">
          <ShieldCheck size={16} /> <span>{t('privacy_note')}</span>
        </div>

        <p className="text-sm text-[#6B7280] text-center mt-4">
          {t('auth.have_account')}{' '}
          <Link to="/login" className="text-[#0A0A0A] font-semibold hover:opacity-70">{t('auth.login_link')}</Link>
        </p>
      </div>
    </div>
  );
}
