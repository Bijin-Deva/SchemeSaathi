import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SchemeCard from '../components/SchemeCard';

const STATES = ['Andhra Pradesh', 'Telangana', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Uttar Pradesh', 'Rajasthan', 'Gujarat', 'West Bengal', 'Bihar', 'Madhya Pradesh', 'National'];
const GENDERS = ['Male', 'Female', 'Other'];
const CASTES = ['General', 'OBC', 'SC', 'ST'];

export default function Profile() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', age: '', gender: '', state: '', income: '', occupation: '', caste_category: '' });
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        age: user.age || '',
        gender: user.gender || '',
        state: user.state || '',
        income: user.income || '',
        occupation: user.occupation || '',
        caste_category: user.caste_category || '',
      });
    }
    api.get('/api/profile/saved-schemes').then(({ data }) => setSavedSchemes(data)).catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      const { data } = await api.put('/api/profile', form);
      updateUser({ ...user, ...data });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {}
    finally { setSaving(false); }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('profile.title')}</h1>

      {/* Privacy Note */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-yellow-800 rounded-r-lg mb-6">
        🔒 {t('privacy_note')}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.name')}</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.age')}</label>
            <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} min="0" max="120"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.gender')}</label>
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
              <option value="">Select</option>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.state')}</label>
            <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
              <option value="">Select</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.income')}</label>
            <input type="number" value={form.income} onChange={(e) => setForm({ ...form, income: e.target.value })} min="0"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.occupation')}</label>
            <input type="text" value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.caste')}</label>
            <select value={form.caste_category} onChange={(e) => setForm({ ...form, caste_category: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
              <option value="">Select</option>
              {CASTES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="md:col-span-2 flex items-center gap-4">
            <button type="submit" disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-8 py-2.5 rounded-lg font-medium text-sm transition-colors">
              {saving ? t('common.loading') : t('profile.save_btn')}
            </button>
            {success && <span className="text-green-600 text-sm font-medium">✓ Profile saved!</span>}
          </div>
        </form>
      </div>

      {/* Saved Schemes */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('profile.saved_schemes')}</h2>
        {savedSchemes.length === 0 ? (
          <p className="text-gray-500 text-sm">{t('profile.no_saved')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {savedSchemes.map((s) => <SchemeCard key={s.id} scheme={s} />)}
          </div>
        )}
      </section>
    </div>
  );
}
