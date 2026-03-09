import React from 'react';

export default function GalleryCard({ title, src, alt }: { title: string; src: string; alt?: string }) {
  return (
    <figure className="card">
      <img src={src} alt={alt || title} style={{ maxWidth: '100%' }} />
      <figcaption>{title}</figcaption>
    </figure>
  );
}
