import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SchemeCard from '../components/SchemeCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

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
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-yellow-800 rounded-r-lg mb-6">
        🔒 {t('eligibility.privacy_banner')}
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('eligibility.title')}</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('eligibility.age')}</label>
            <input type="number" name="age" value={form.age} onChange={handleChange} min="0" max="120"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('eligibility.gender')}</label>
            <select name="gender" value={form.gender} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
              <option value="">Select</option>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('eligibility.state')}</label>
            <select name="state" value={form.state} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
              <option value="">Select</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('eligibility.income')}</label>
            <input type="number" name="income" value={form.income} onChange={handleChange} min="0"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('eligibility.occupation')}</label>
            <input type="text" name="occupation" value={form.occupation} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('eligibility.caste')}</label>
            <select name="caste" value={form.caste} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
              <option value="">Select</option>
              {CASTES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-8 py-2.5 rounded-lg font-medium text-sm transition-colors">
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
