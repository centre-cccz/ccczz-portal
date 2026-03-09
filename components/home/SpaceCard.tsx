import React from 'react';

type SpaceCardProps = {
  name: string;
  description: string;
  badge: string;
  image: string;
  imageAlt: string;
};

export default function SpaceCard({ name, description, badge, image, imageAlt }: SpaceCardProps) {
  return (
    <article className="space-card">
      <div className="space-media">
        <img src={image} alt={imageAlt} loading="lazy" />
        <div className="space-overlay" aria-hidden="true" />
        <div className="space-content">
          <span className="space-badge">{badge}</span>
          <h3>{name}</h3>
          <p>{description}</p>
        </div>
      </div>
    </article>
  );
}
