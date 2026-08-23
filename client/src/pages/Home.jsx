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
      <section className="home-hero bg-gradient-to-br from-orange-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t('home.hero_title')}</h1>
          <p className="text-lg text-gray-600 mb-8">{t('home.hero_subtitle')}</p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('home.search_placeholder')}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
            />
            <button type="submit" aria-label="Search" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="home-stats-bar bg-orange-500 py-4">
        <div className="max-w-4xl mx-auto flex justify-center gap-12 text-white text-sm font-medium">
          <span>{t('home.stats_schemes')}</span>
          <span>{t('home.stats_languages')}</span>
          <span>{t('home.stats_free')}</span>
        </div>
      </section>

      <section className="home-features home-original max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('home.featured_title')}</h2>
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
            className="home-view-all text-sm text-orange-500 hover:text-orange-600 font-medium"
          >
            View All <ArrowRight size={15} />
          </button>
        </div>
      </section>

      
    </div>
  );
}
