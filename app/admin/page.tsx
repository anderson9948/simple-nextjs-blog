"use client"

import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import AdminFormClient from '../../components/AdminFormClient';
import AdminPostList from '../../components/AdminPostList';

export default function AdminPageClient() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn('credentials');
    }
  }, [status]);

  if (status === 'loading') return null;
  if (status === 'unauthenticated') return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="space-y-8">
        <AdminFormClient />
        <AdminPostList />
      </div>
    </div>
  );
}