import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function SchemeCard({ scheme }) {
  const { t } = useTranslation();

  const categoryColors = {
    Agriculture: 'bg-green-100 text-green-800',
    Education: 'bg-blue-100 text-blue-800',
    Health: 'bg-red-100 text-red-800',
    Housing: 'bg-yellow-100 text-yellow-800',
    Employment: 'bg-purple-100 text-purple-800',
    'Women Empowerment': 'bg-pink-100 text-pink-800',
  };
  const colorClass = categoryColors[scheme.category] || 'bg-gray-100 text-gray-800';

  return (
    <div className="scheme-card bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 text-base leading-snug">{scheme.name}</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${colorClass}`}>
          {scheme.category}
        </span>
      </div>
      <p className="text-sm text-gray-600 line-clamp-3">{scheme.description}</p>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-500">{scheme.state}</span>
        {scheme.matchScore !== undefined && (
          <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
            {t('eligibility.match_score')}: {scheme.matchScore}
          </span>
        )}
        <Link
          to={`/schemes/${scheme.id}`}
          className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
        >
          {t('common.view_details')} →
        </Link>
      </div>
    </div>
  );
}
