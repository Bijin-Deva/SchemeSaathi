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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('about.title')}</h1>
      <p className="text-gray-500 mb-10 text-sm">Empowering every Indian citizen with information</p>

      {/* Mission */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">{t('about.mission')}</h2>
        <p className="text-gray-600 leading-relaxed">{t('about.mission_text')}</p>
      </section>

      {/* How it works */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">{t('about.how_it_works')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={step.key} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-4xl mb-3">{step.icon}</div>
              <div className="text-orange-500 font-bold text-sm mb-1">Step {i + 1}</div>
              <h3 className="font-semibold text-gray-800 mb-2">{t(`about.${step.key}_title`)}</h3>
              <p className="text-sm text-gray-600">{t(`about.${step.key}_text`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy Note */}
      <section className="mb-10">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-yellow-800 rounded-r-lg">
          <strong>🔒 Data Privacy:</strong> {t('privacy_note')}
        </div>
      </section>
    </div>
  );
}
