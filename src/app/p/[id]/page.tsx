'use client';

import React, { useEffect, useState } from 'react';
import { use } from 'react';
import { supabase } from '@/store/auth';
import { FormData } from '@/types';
import PublicPortfolioView from '@/components/portfolio/PublicPortfolioView';

type ParamsType = Promise<{ id: string }>;

export default function PublicPortfolioPage({ params }: { params: ParamsType }) {
  const { id: portfolioId } = use(params);

  const [portfolioData, setPortfolioData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const { data: portfolioDataArray, error: portfolioError } = await supabase
          .from('user_portfolios')
          .select('user_id, is_published')
          .eq('portfolio_id', portfolioId);

        if (portfolioError) throw portfolioError;

        if (!portfolioDataArray || portfolioDataArray.length === 0) {
          throw new Error('Portfolio not found');
        }

        const portfolioData = portfolioDataArray[0];

        if (!portfolioData.is_published) {
          throw new Error('This portfolio is not currently published');
        }

        const { data: formDataArray, error: formError } = await supabase
          .from('intern_forms')
          .select('form_data')
          .eq('user_id', portfolioData.user_id);

        if (formError) throw formError;

        if (!formDataArray || formDataArray.length === 0) {
          throw new Error('Portfolio data not found');
        }

        setPortfolioData(formDataArray[0].form_data);
      } catch (error: unknown) {
        console.error('Error fetching portfolio:', error);
        setError((error as Error).message || 'Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, [portfolioId]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-3xl font-medium">
          Intern<span className="font-bold">folio</span>
        </div>
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-xl text-red-400">{error || 'Portfolio not found'}</div>
      </div>
    );
  }

  return <PublicPortfolioView data={portfolioData} />;
}
