"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/store/auth";
import { FormData } from "@/types";
import PublicPortfolioView from "@/components/portfolio/PublicPortfolioView";

export default function PublicPortfolioPage({
  params,
}: {
  params: { id: string };
}) {
  const [portfolioData, setPortfolioData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id: portfolioId } = params;

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        // First get the user_id from the portfolio_id
        const { data: portfolioData, error: portfolioError } = await supabase
          .from("user_portfolios")
          .select("user_id, is_published")
          .eq("portfolio_id", portfolioId)
          .single();

        if (portfolioError) throw portfolioError;

        // Check if portfolio is published
        if (!portfolioData.is_published) {
          throw new Error("This portfolio is not currently published");
        }

        // Then get the form data for that user
        const { data: formData, error: formError } = await supabase
          .from("intern_forms")
          .select("form_data")
          .eq("user_id", portfolioData.user_id)
          .single();

        if (formError) throw formError;

        setPortfolioData(formData.form_data);
      } catch (error: unknown) {
        console.error("Error fetching portfolio:", error);
        setError((error as Error).message || "Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, [portfolioId]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-xl">Loading portfolio...</div>
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-xl text-red-400">
          {error || "Portfolio not found"}
        </div>
      </div>
    );
  }

  return <PublicPortfolioView data={portfolioData} />;
}
