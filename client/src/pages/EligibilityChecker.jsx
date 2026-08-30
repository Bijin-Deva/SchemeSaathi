import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SchemeCard from '../components/SchemeCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

const STATES = ['Andhra Pradesh', 'Telangana', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Uttar Pradesh', 'Rajasthan', 'Gujarat', 'West Bengal', 'Bihar', 'Madhya Pradesh', 'National'];
const GENDERS = ['Male', 'Female', 'Other'];
const CASTES = ['General', 'OBC', 'SC', 'ST'];

export default function EligibilityChecker() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [form, setForm] = useState({ age: '', gender: '', state: '', income: '', occupation: '', caste: '' });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        age: user.age || '',
        gender: user.gender || '',
        state: user.state || '',
        income: user.income || '',
        occupation: user.occupation || '',
        caste: user.caste_category || '',
      });
    }
  }, [user]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/eligibility/check', form);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Privacy banner */}
      <div className="privacy-banner bg-[#F3F3F3] border border-[#E5E5E5] p-4 text-sm text-[#0A0A0A] rounded-xl mb-6 flex items-center gap-2">
        <ShieldCheck size={18} /> <span>{t('eligibility.privacy_banner')}</span>
      </div>

      <h1 className="text-2xl font-bold text-[#0A0A0A] mb-6">{t('eligibility.title')}</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E8E8] p-6 mb-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1">{t('eligibility.age')}</label>
            <input type="number" name="age" value={form.age} onChange={handleChange} min="0" max="120"
              className="w-full border border-[#E5E5E5] bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1">{t('eligibility.gender')}</label>
            <select name="gender" value={form.gender} onChange={handleChange}
              className="w-full border border-[#E5E5E5] bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]">
              <option value="">Select</option>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1">{t('eligibility.state')}</label>
            <select name="state" value={form.state} onChange={handleChange}
              className="w-full border border-[#E5E5E5] bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]">
              <option value="">Select</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1">{t('eligibility.income')}</label>
            <input type="number" name="income" value={form.income} onChange={handleChange} min="0"
              className="w-full border border-[#E5E5E5] bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1">{t('eligibility.occupation')}</label>
            <input type="text" name="occupation" value={form.occupation} onChange={handleChange}
              className="w-full border border-[#E5E5E5] bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1">{t('eligibility.caste')}</label>
            <select name="caste" value={form.caste} onChange={handleChange}
              className="w-full border border-[#E5E5E5] bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]">
              <option value="">Select</option>
              {CASTES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={loading}
              className="bg-[#0A0A0A] hover:bg-black disabled:bg-gray-300 text-white px-8 py-2.5 rounded-full font-medium text-sm transition-colors shadow-sm">
              {loading ? t('common.loading') : t('eligibility.submit')}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {results !== null && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('eligibility.results_title')} ({results.length})</h2>
          {results.length === 0 ? (
            <p className="text-gray-500 text-sm">{t('eligibility.no_results')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((s) => <SchemeCard key={s.id} scheme={s} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
