import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SchemeCard from '../components/SchemeCard';
import api from '../services/api';

const CATEGORIES = ['Agriculture', 'Education', 'Health', 'Housing', 'Employment', 'Women Empowerment'];
const STATES = ['National', 'Andhra Pradesh', 'Telangana', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Uttar Pradesh', 'Rajasthan', 'Gujarat'];
const GENDERS = ['Male', 'Female', 'Any'];
const CASTES = ['General', 'OBC', 'SC', 'ST', 'Any'];
const PAGE_SIZE = 9;

export default function Schemes() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const state = searchParams.get('state') || '';
  const gender = searchParams.get('gender') || '';
  const caste = searchParams.get('caste') || '';

  useEffect(() => {
    setLoading(true);
    setPage(1);
    const params = {};
    if (q) params.q = q;
    if (category) params.category = category;
    if (state) params.state = state;
    if (gender) params.gender = gender;
    if (caste) params.caste = caste;
    api.get('/api/schemes', { params })
      .then(({ data }) => setSchemes(data))
      .catch(() => setSchemes([]))
      .finally(() => setLoading(false));
  }, [q, category, state, gender, caste]);

  function setFilter(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('q');
    setSearchParams(next);
  }

  const paginated = schemes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(schemes.length / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 space-y-5">
        <h2 className="font-semibold text-gray-800 text-sm">Filters</h2>

        {[
          { label: t('scheme.category'), key: 'category', options: CATEGORIES },
          { label: t('profile.state'), key: 'state', options: STATES },
          { label: t('eligibility.gender'), key: 'gender', options: GENDERS },
          { label: t('eligibility.caste'), key: 'caste', options: CASTES },
        ].map(({ label, key, options }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <select
              value={searchParams.get(key) || ''}
              onChange={(e) => setFilter(key, e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <option value="">All</option>
              {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}

        <button
          onClick={() => setSearchParams({})}
          className="text-xs text-orange-500 hover:text-orange-600"
        >
          Clear Filters
        </button>
      </aside>

      {/* Main area */}
      <div className="flex-1">
        {/* Search bar */}
        <form
          onSubmit={(e) => { e.preventDefault(); const val = e.target.q.value.trim(); const next = new URLSearchParams(); if (val) next.set('q', val); setSearchParams(next); }}
          className="flex gap-2 mb-6"
        >
          <input
            name="q"
            defaultValue={q}
            placeholder={t('scheme.search_placeholder')}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
          <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">Search</button>
        </form>

        {loading ? (
          <div className="text-center py-20 text-gray-400">{t('common.loading')}</div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-20 text-gray-400">{t('scheme.no_results')}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginated.map((s) => <SchemeCard key={s.id} scheme={s} />)}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 rounded border text-sm disabled:opacity-40">←</button>
                <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 rounded border text-sm disabled:opacity-40">→</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
