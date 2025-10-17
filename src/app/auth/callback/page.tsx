'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/auth';
import useFormStore from '@/store/useFormStore';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { checkAuth } = useAuthStore();
  const { loadFromSupabase } = useFormStore();

  useEffect(() => {
    const handleCallback = async () => {
      await checkAuth();
      await loadFromSupabase(); // Load form data after authentication
      router.push('/');
    };

    handleCallback();
  }, [checkAuth, loadFromSupabase, router]);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="text-xl">Completing authentication...</div>
    </div>
  );
}
