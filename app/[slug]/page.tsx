import React from 'react';
import { notFound } from 'next/navigation';
import PageShell from '../../components/PageShell';
import { getPage, pages } from '../../content/pages';

export default function DynamicPage({ params }: { params: { slug: string } }) {
  const page = getPage(params.slug);
  if (!page) {
    return notFound();
  }

  return <PageShell title={page.title} intro={page.intro} sections={page.sections} />;
}

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}
