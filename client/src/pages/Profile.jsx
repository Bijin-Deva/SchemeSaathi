import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SchemeCard from '../components/SchemeCard';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

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
      <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">{t('profile.title')}</h1>

      {/* Privacy Note */}
      <div className="bg-[#F3F3F3] border border-[#E5E5E5] p-4 text-sm text-[#0A0A0A] rounded-xl mb-6 flex items-center gap-2">
        <ShieldCheck size={16} /> <span>{t('privacy_note')}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E8E8] p-6 mb-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1">{t('auth.name')}</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-[#E5E5E5] bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1">{t('profile.age')}</label>
            <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} min="0" max="120"
              className="w-full border border-[#E5E5E5] bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1">{t('profile.gender')}</label>
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full border border-[#E5E5E5] bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]">
              <option value="">Select</option>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1">{t('profile.state')}</label>
            <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="w-full border border-[#E5E5E5] bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]">
              <option value="">Select</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1">{t('profile.income')}</label>
            <input type="number" value={form.income} onChange={(e) => setForm({ ...form, income: e.target.value })} min="0"
              className="w-full border border-[#E5E5E5] bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1">{t('profile.occupation')}</label>
            <input type="text" value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })}
              className="w-full border border-[#E5E5E5] bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1">{t('profile.caste')}</label>
            <select value={form.caste_category} onChange={(e) => setForm({ ...form, caste_category: e.target.value })}
              className="w-full border border-[#E5E5E5] bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]">
              <option value="">Select</option>
              {CASTES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="md:col-span-2 flex items-center gap-4">
            <button type="submit" disabled={saving}
              className="bg-[#0A0A0A] hover:bg-black disabled:bg-gray-300 text-white px-8 py-2.5 rounded-full font-medium text-sm transition-colors shadow-sm">
              {saving ? t('common.loading') : t('profile.save_btn')}
            </button>
            {success && <span className="text-[#0A0A0A] text-sm font-semibold success-message flex items-center gap-1"><CheckCircle2 size={15} /> Profile saved!</span>}
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
