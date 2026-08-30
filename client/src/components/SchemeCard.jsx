import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function SchemeCard({ scheme }) {
  const { t } = useTranslation();

  const categoryColors = {
    Agriculture: 'bg-green-100 text-green-800 border border-green-200',
  };
  const colorClass = categoryColors[scheme.category] || 'bg-[#F3F3F3] text-[#0A0A0A] border border-[#E5E5E5]';

  return (
    <div className="scheme-card recommended-card shimmer-card bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-gray-900 text-base leading-normal">{scheme.name}</h3>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap self-start ${colorClass}`}>
          {scheme.category}
        </span>
      </div>
      <p className="text-sm text-gray-600 line-clamp-3">{scheme.description}</p>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#E8E8E8]">
        <span className="text-xs text-gray-500">{scheme.state}</span>
        {scheme.matchScore !== undefined && (
          <span className="text-xs font-medium bg-[#F3F3F3] text-[#0A0A0A] border border-[#E5E5E5] px-2.5 py-0.5 rounded-full">
            {t('eligibility.match_score')}: {scheme.matchScore}
          </span>
        )}
        <Link
          to={`/schemes/${scheme.id}`}
          className="text-sm font-semibold text-[#0A0A0A] hover:opacity-70 transition-opacity"
        >
          {t('common.view_details')} →
        </Link>
      </div>
    </div>
  );
}
