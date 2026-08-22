import React from 'react';
import { useTranslation } from 'react-i18next';

const steps = [
  { icon: '🔍', key: 'step1' },
  { icon: '✅', key: 'step2' },
  { icon: '📋', key: 'step3' },
];

export default function About() {
  const { t } = useTranslation();
  return (
    <div className="about-page max-w-4xl mx-auto px-4 py-12">
      <header className="about-hero">
        <div className="about-hero-copy">
          <div className="about-kicker">ABOUT / SCHEME-SAATHI</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('about.title')}</h1>
          <p className="text-gray-500 mb-10 text-sm">Empowering every Indian citizen with information</p>
        </div>
        <section className="about-mission about-hero-card">
          <div className="about-index">01 / WHY WE EXIST</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">{t('about.mission')}</h2>
          <p className="text-gray-600 leading-relaxed">{t('about.mission_text')}</p>
          <div className="about-card-note">Built to make essential information easier to find and understand.</div>
        </section>
      </header>

      {/* How it works */}
      <section className="about-steps mb-10">
        <div className="about-section-heading">
          <div className="about-index">02 / THE PROCESS</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{t('about.how_it_works')}</h2>
        </div>
        <div className="about-steps-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={step.key} className="about-step bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="about-step-icon text-4xl mb-3">{step.icon}</div>
              <div className="about-step-number text-orange-500 font-bold text-sm mb-1">Step {i + 1}</div>
              <h3 className="font-semibold text-gray-800 mb-2">{t(`about.${step.key}_title`)}</h3>
              <p className="text-sm text-gray-600">{t(`about.${step.key}_text`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy Note */}
      <section className="about-privacy mb-10">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-yellow-800 rounded-r-lg">
          <strong>🔒 Data Privacy:</strong> {t('privacy_note')}
        </div>
      </section>
    </div>
  );
}
