import React from 'react';

export default function EspacesFaqPage() {
  return (
    <section className="container">
      <h1>FAQ — Espaces</h1>
      <p>FAQ intégrée via iframe ci‑dessous.</p>
      <iframe src="/espaces/faq.html" title="FAQ Espaces" style={{ width: '100%', height: 480, border: '1px solid #ccc' }} />
    </section>
  );
}
