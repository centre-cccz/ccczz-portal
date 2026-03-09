import React from 'react';
import ArtistCard from '../cards/ArtistCard';

export default function ArtistsSection({ artists }: { artists: { name: string; discipline: string; bio?: string }[] }) {
  return (
    <section>
      <h2>Artistes</h2>
      <div className="grid">
        {artists.map((a, i) => (<ArtistCard key={i} name={a.name} discipline={a.discipline} bio={a.bio} />))}
      </div>
    </section>
  );
}
