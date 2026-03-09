import React from 'react';
import mockDirections from '../../lib/mock-data/directions';
import DirectionCard from '../../components/cards/DirectionCard';

export default function DirectionsPage() {
  return (
    <section className="container">
      <h1>Directions du Centre</h1>
      <p>Présentation des directions et des responsables.</p>
      <div className="grid">
        {mockDirections.map((d, i) => (
          <DirectionCard key={i} name={d.name} role={d.role} description={d.description} />
        ))}
      </div>
    </section>
  );
}
