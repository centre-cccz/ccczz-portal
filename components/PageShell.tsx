import React from 'react';
import Section from './Section';

type PageSection = {
  title?: string;
  body: string;
};

type PageShellProps = {
  title: string;
  intro?: string;
  sections?: PageSection[];
};

export default function PageShell({ title, intro, sections }: PageShellProps) {
  return (
    <>
      <section className="container">
        <h1>{title}</h1>
        {intro && <p className="mt-2">{intro}</p>}
      </section>
      {sections?.map((section, index) => (
        <Section key={`${section.title ?? 'section'}-${index}`} title={section.title}>
          <p>{section.body}</p>
        </Section>
      ))}
    </>
  );
}
