import React from 'react';
import PartnerCard from '../cards/PartnerCard';

export default function PartnersSection() {
  const partners = [
    { name: 'Ministère de la Culture', role: 'Partenaire institutionnel' },
    { name: 'Association des Arts', role: 'Partenaire culturel' }
  ];
  return (
    <section>
      <h2>Partenaires</h2>
      <div className="grid">
        {partners.map((p, i) => (<PartnerCard key={i} name={p.name} role={p.role} />))}
      </div>
    </section>
  );
}
