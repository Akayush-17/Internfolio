
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initMixpanel, trackEvent } from '@/lib/mixpanel';

export default function MixpanelAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    initMixpanel();
  }, []);

  useEffect(() => {
    if (pathname) {
      trackEvent("Page Viewed", { page: pathname });
    }
  }, [pathname]);

  return null; 
}
