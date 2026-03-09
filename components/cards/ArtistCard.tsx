import React from 'react';

type ArtistCardProps = {
  name: string;
  discipline: string;
  bio?: string;
  className?: string;
};

export default function ArtistCard({ name, discipline, bio, className }: ArtistCardProps) {
  return (
    <article className={`card ${className || ''}`.trim()}>
      <div className="flex items-start gap-4">
        <div className="icon-wrapper" aria-hidden>
          <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="3" fill="#E6E6E6" />
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="#E6E6E6" />
          </svg>
        </div>

        <div>
          <h3>{name}</h3>
          <p className="artist-discipline">{discipline}</p>
        </div>
      </div>

      <p className="artist-bio mt-3">{bio || 'Description courte de l’artiste.'}</p>
    </article>
  );
}
