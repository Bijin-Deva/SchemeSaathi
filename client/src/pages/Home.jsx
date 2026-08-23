import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SchemeCard from '../components/SchemeCard';
import api from '../services/api';
import { Activity, ArrowRight, CheckCircle2, FileText, Languages, LockKeyhole, Search, ShieldCheck, Sparkles, Users } from 'lucide-react';

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
      <section className="home-hero px-4">
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <div className="home-badge"><Sparkles size={13} /> AI-POWERED <span>•</span> SECURE <span>•</span> GOV-VERIFIED</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t('home.hero_title')}</h1>
            <p className="text-lg text-gray-600 mb-8">{t('home.hero_subtitle')}</p>

            <form onSubmit={handleSearch} className="home-search flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('home.search_placeholder')}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
            />
            <button type="submit" aria-label="Search" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              <Search size={18} strokeWidth={1.5} />
            </button>
            </form>

            <div className="home-stats">
              <span><CheckCircle2 size={16} /> {t('home.stats_schemes')}</span>
              <span><Languages size={16} /> {t('home.stats_languages')}</span>
              <span><LockKeyhole size={16} /> {t('home.stats_free')}</span>
            </div>
          </div>

          <aside className="recommendation-card">
            <div className="recommendation-label"><Sparkles size={13} /> AI Recommended for You</div>
            <h2>{t('home.featured_title')}</h2>
            {featuredSchemes[0] ? (
              <SchemeCard scheme={featuredSchemes[0]} />
            ) : (
              <div className="recommendation-loading">{t('common.loading')}</div>
            )}
          </aside>
        </div>
      </section>

      {/* Featured Schemes */}
      <section className="home-features max-w-7xl mx-auto px-4 py-12">
        <div className="home-section-heading">
          <h2>Powerful features, built for clarity</h2>
          <p>Everything you need to discover, qualify, and apply — designed to be simple and trusted.</p>
        </div>
        <div className="feature-bento">
          <article className="feature-tile">
            <div className="feature-icon"><ShieldCheck size={18} /></div>
            <h3>Smart Eligibility Check</h3>
            <p>{t('services.eligibility_text')}</p>
          </article>
          <article className="feature-tile">
            <div className="feature-icon"><Sparkles size={18} /></div>
            <h3>Personalized Recommendations</h3>
            <p>{t('services.discovery_text')}</p>
          </article>
          <article className="feature-tile">
            <div className="feature-icon"><LockKeyhole size={18} /></div>
            <h3>Trusted &amp; Secure</h3>
            <p>{t('privacy_note')}</p>
          </article>
          <article className="feature-tile feature-document">
            <div className="feature-icon"><FileText size={18} /></div>
            <h3>Document Assistance</h3>
            <p>{t('about.step3_text')}</p>
          </article>
          <article className="feature-tile feature-tracking">
            <div className="feature-icon"><Activity size={18} /></div>
            <h3>Real-time Application Tracking</h3>
            <p>{t('about.step2_text')}</p>
          </article>
          <article className="feature-process">
            <h3>{t('about.how_it_works')}</h3>
            <div className="process-items">
              <div><strong>01</strong><b>{t('about.step1_title')}</b><span>{t('about.step1_text')}</span></div>
              <div><strong>03</strong><b>{t('about.step3_title')}</b><span>{t('about.step3_text')}</span></div>
            </div>
          </article>
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
