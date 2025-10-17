'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FormLayout from '@/components/form-layout';
import useAuthStore from '@/store/auth';

export default function FormPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return <main>{isAuthenticated && <FormLayout />}</main>;
}
