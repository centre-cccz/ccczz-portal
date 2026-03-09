"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import directors from '@/lib/directions';

const INTERVAL = 7000; // 7s per slide

function PlaceholderAvatar({ className = '' }: { className?: string }) {
    return (
        <div
            className={"w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center " + className}
            aria-hidden
        >
            <svg width="80%" height="80%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
                <rect width="24" height="24" rx="4" fill="#F3F4F6" />
                <path d="M12 12a3 3 0 100-6 3 3 0 000 6zm0 1.5c-3 0-5.5 1.5-5.5 3v.75A1.75 1.75 0 008.25 19h7.5A1.75 1.75 0 0017.5 17.25V16.5c0-1.5-2.5-3-5.5-3z" fill="#9CA3AF" />
            </svg>
        </div>
    );
}

export default function DirectionCarousel() {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (paused) return;
        timerRef.current = window.setTimeout(() => {
            setIndex((i) => (i + 1) % directors.length);
        }, INTERVAL);
        return () => {
            if (timerRef.current) window.clearTimeout(timerRef.current);
        };
    }, [index, paused]);

    const goTo = (i: number) => {
        setIndex(i % directors.length);
    };

    const prev = () => setIndex((i) => (i - 1 + directors.length) % directors.length);
    const next = () => setIndex((i) => (i + 1) % directors.length);

    const current = directors[index];

    return (
        <section
            aria-label="La Direction"
            className="mb-10 px-4 py-8 bg-gradient-to-r from-amber-50 via-white to-rose-50 rounded-lg shadow-inner"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-6">
                    {/* Image */}
                    <div className="flex-shrink-0 w-40 h-40 lg:w-56 lg:h-56 rounded-full overflow-hidden shadow-lg bg-white">
                        {current.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <Image
                                src={current.image}
                                alt={`Photo de ${current.name}`}
                                width={560}
                                height={560}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <PlaceholderAvatar />
                        )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 text-center lg:text-left">
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900">{current.name}</h3>
                        <p className="text-sm text-amber-700 font-medium mt-1">{current.title}</p>
                        <p className="text-sm text-gray-600 mt-3 max-w-2xl mx-auto lg:mx-0">{current.description}</p>

                        <div className="mt-4 flex flex-wrap items-center gap-3 justify-center lg:justify-start">
                            <a
                                href={`mailto:${current.email}`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-bordeaux-600 bg-[#6B1021] hover:opacity-95 text-white rounded-lg shadow-sm text-sm font-semibold"
                                aria-label={`Envoyer un email à ${current.name}`}
                            >
                                Contacter ({current.email.split('@')[0]})
                            </a>

                            {current.phone && (
                                <a href={`tel:${current.phone}`} className="text-sm text-gray-700 underline">
                                    {current.phone}
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="w-full lg:w-auto flex items-center justify-center lg:justify-end gap-3">
                        <button
                            onClick={prev}
                            className="p-2 rounded-full bg-white shadow hover:scale-105 transition"
                            aria-label="Profil précédent"
                        >
                            ‹
                        </button>
                        <div className="flex items-center gap-2">
                            {directors.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i)}
                                    aria-label={`Aller au profil ${i + 1}`}
                                    className={`w-3 h-3 rounded-full ${i === index ? 'bg-amber-700' : 'bg-gray-300'} transition`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={next}
                            className="p-2 rounded-full bg-white shadow hover:scale-105 transition"
                            aria-label="Profil suivant"
                        >
                            ›
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
