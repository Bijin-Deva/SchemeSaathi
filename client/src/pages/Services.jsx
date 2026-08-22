import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const services = [
  { icon: '🔍', titleKey: 'services.discovery_title', textKey: 'services.discovery_text', path: '/schemes' },
  { icon: '✅', titleKey: 'services.eligibility_title', textKey: 'services.eligibility_text', path: '/eligibility' },
  { icon: '🤖', titleKey: 'services.ai_title', textKey: 'services.ai_text', path: null },
  { icon: '🌐', titleKey: 'services.multilingual_title', textKey: 'services.multilingual_text', path: null },
];

export default function Services() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('services.title')}</h1>
        <p className="text-gray-500 text-sm">Everything you need to access government benefits</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((svc) => (
          <div
            key={svc.titleKey}
            className={`bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow ${svc.path ? 'cursor-pointer' : ''}`}
            onClick={() => svc.path && navigate(svc.path)}
          >
            <div className="text-4xl mb-4">{svc.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t(svc.titleKey)}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{t(svc.textKey)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
