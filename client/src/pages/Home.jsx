import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SchemeCard from '../components/SchemeCard';
import api from '../services/api';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [featuredSchemes, setFeaturedSchemes] = useState([]);

  useEffect(() => {
    api.get('/api/schemes').then(({ data }) => setFeaturedSchemes(data.slice(0, 6))).catch(() => {});
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) navigate(`/schemes?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="home-hero shimmer-marble py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] mb-4 tracking-tight">{t('home.hero_title')}</h1>
          <p className="text-lg text-[#6B7280] mb-8">{t('home.hero_subtitle')}</p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('home.search_placeholder')}
              className="flex-1 border border-[#E5E5E5] bg-white rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#0A0A0A] text-sm text-[#0A0A0A] shadow-sm"
            />
            <button type="submit" aria-label="Search" className="bg-[#0A0A0A] hover:bg-black text-white px-7 py-3 rounded-full font-medium transition-colors shadow-sm text-sm">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="home-stats-bar py-5 bg-[#0A0A0A] border-y border-[#262626]">
        <div className="max-w-4xl mx-auto flex justify-center gap-5 text-sm font-medium flex-wrap px-4">
          <span className="stat-pill inline-flex items-center gap-2 bg-white border border-[#E5E5E5] px-4 py-1.5 rounded-full text-xs font-bold text-[#0A0A0A] shadow-sm">
            <span className="stat-dot w-2 h-2 rounded-full bg-[#0A0A0A] inline-block flex-shrink-0" />
            {t('home.stats_schemes')}
          </span>
          <span className="stat-pill inline-flex items-center gap-2 bg-white border border-[#E5E5E5] px-4 py-1.5 rounded-full text-xs font-bold text-[#0A0A0A] shadow-sm">
            <span className="stat-dot w-2 h-2 rounded-full bg-[#0A0A0A] inline-block flex-shrink-0" />
            {t('home.stats_languages')}
          </span>
          <span className="stat-pill inline-flex items-center gap-2 bg-white border border-[#E5E5E5] px-4 py-1.5 rounded-full text-xs font-bold text-[#0A0A0A] shadow-sm">
            <span className="stat-dot w-2 h-2 rounded-full bg-[#0A0A0A] inline-block flex-shrink-0" />
            {t('home.stats_free')}
          </span>
        </div>
      </section>

      <section className="home-features home-original max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#0A0A0A]">{t('home.featured_title')}</h2>
        </div>
        {featuredSchemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredSchemes.map((s) => <SchemeCard key={s.id} scheme={s} />)}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">{t('common.loading')}</div>
        )}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => navigate('/schemes')}
            className="home-view-all text-sm text-[#0A0A0A] hover:opacity-70 font-semibold inline-flex items-center gap-1.5"
          >
            View All <ArrowRight size={15} />
          </button>
        </div>
      </section>

      
    </div>
  );
}
