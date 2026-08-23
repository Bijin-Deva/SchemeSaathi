import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, ExternalLink, FileText, Gift, ShieldCheck } from 'lucide-react';

export default function SchemeDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get(`/api/schemes/${id}`)
      .then(({ data }) => setScheme(data))
      .catch(() => navigate('/schemes'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    try {
      await api.post('/api/profile/saved-schemes', { schemeId: Number(id) });
      setSaved(true);
    } catch {}
  }

  if (loading) return <div className="text-center py-20 text-gray-400">{t('common.loading')}</div>;
  if (!scheme) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-sm text-orange-500 hover:text-orange-600 mb-6 flex items-center gap-1">
        ← {t('common.back')}
      </button>

      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{scheme.name}</h1>
          <span className="text-xs font-medium bg-orange-100 text-orange-700 px-3 py-1 rounded-full whitespace-nowrap">{scheme.category}</span>
        </div>
        <p className="text-xs text-gray-500 mb-5">{scheme.state}</p>
        <p className="text-gray-700 leading-relaxed mb-6">{scheme.description}</p>

        {/* Benefits */}
        <section className="mb-5">
          <h2 className="detail-heading text-base font-semibold text-gray-800 mb-2"><Gift size={16} /> {t('scheme.benefits')}</h2>
          <p className="text-sm text-gray-600">{scheme.benefits}</p>
        </section>

        {/* Eligibility */}
        <section className="mb-5">
          <h2 className="detail-heading text-base font-semibold text-gray-800 mb-2"><CheckCircle2 size={16} /> {t('scheme.eligibility')}</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>Age: {scheme.eligibility_age_min} – {scheme.eligibility_age_max === 999 ? 'No limit' : scheme.eligibility_age_max}</li>
            <li>Gender: {scheme.eligibility_gender}</li>
            <li>Caste: {scheme.eligibility_caste}</li>
            <li>Max Annual Income: {scheme.eligibility_income_max >= 99999999 ? 'No limit' : `₹${scheme.eligibility_income_max.toLocaleString('en-IN')}`}</li>
          </ul>
        </section>

        {/* Documents */}
        <section className="mb-8">
          <h2 className="detail-heading text-base font-semibold text-gray-800 mb-2"><FileText size={16} /> {t('scheme.documents')}</h2>
          <p className="text-sm text-gray-600">{scheme.documents_required}</p>
        </section>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <a
            href={scheme.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors"
          >
            {t('scheme.apply_now')} <ExternalLink size={15} />
          </a>
          {user && (
            <button
              onClick={handleSave}
              disabled={saved}
              className={`px-6 py-2.5 rounded-lg font-medium text-sm border transition-colors ${saved ? 'border-green-300 text-green-600 bg-green-50' : 'border-orange-300 text-orange-500 hover:bg-orange-50'}`}
            >
              {saved ? <><CheckCircle2 size={15} /> {t('scheme.saved')}</> : <><ShieldCheck size={15} /> {t('scheme.save')}</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
