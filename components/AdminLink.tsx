"use client";

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function AdminLink() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <Link 
      href="/admin" 
      className="fixed bottom-4 right-4 text-xs bg-black/50 hover:bg-black/70 text-white px-3 py-1 rounded-full transition-colors"
    >
      Admin
    </Link>
  );
}