"use client";

import React from 'react';
import Image from 'next/image';
import BumsPng from './logos/BUMS.png';

export default function Footer(): JSX.Element {
  const [year, setYear] = React.useState<number | null>(null);

  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="mx-auto mt-8 flex w-full max-w-3xl items-center justify-between px-4 py-4 text-xs md:text-sm lg:px-0 lg:text-base">
      
    </footer>
  );
}
