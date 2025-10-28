import React from 'react';
import PostGridClient from '../components/PostGridClient';
import AdminLink from '../components/AdminLink';

export default async function Page(): Promise<JSX.Element> {
  return (
    <main className="mx-auto mt-4 w-full flex-col space-y-16 px-4 lg:px-8">
      <PostGridClient />
      <AdminLink />
    </main>
  );
}