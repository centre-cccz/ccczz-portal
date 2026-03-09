'use client';

import React from 'react';
import FilterBar from './FilterBar';
import ArtistGrid from './ArtistGrid';
import { Artist, ArtistMedia, disciplineLabels } from '@/lib/artistes/schema';

interface Props {
    initialArtists: (Artist & { mediaItems: ArtistMedia[] })[];
    total: number;
}

export default function ArtistsPageContentClient({ initialArtists, total }: Props) {
    const [selectedDisciplines, setSelectedDisciplines] = React.useState<string[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 12;

    const filteredArtists = selectedDisciplines.length === 0
        ? initialArtists
        : initialArtists.filter((artist) =>
            artist.disciplines.some((d) => selectedDisciplines.includes(d))
        );

    const totalPages = Math.max(1, Math.ceil(filteredArtists.length / itemsPerPage));

    const paginatedArtists = filteredArtists.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleFilterChange = (filters: { disciplines: string[] }) => {
        setSelectedDisciplines(filters.disciplines);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-white">
            <section className="relative bg-gradient-to-r from-amber-900 to-amber-700 px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Nos Artistes</h1>
                    <p className="mt-4 max-w-2xl text-xl text-amber-100 mx-auto">Découvrir les talents affiliés et résidents du CCCZ</p>
                    <div className="mt-6">
                        <a href="/artistes/soumettre" className="inline-block bg-white text-amber-700 px-5 py-3 rounded-lg font-semibold">Devenir artiste affilié</a>
                    </div>
                </div>
            </section>

            <FilterBar onFilterChange={handleFilterChange} selectedDisciplines={selectedDisciplines} />

            <section className="px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Répertoire des artistes</h2>
                        <p className="mt-2 text-gray-600">{filteredArtists.length} artiste(s) trouvé(s)</p>
                    </div>

                    <ArtistGrid artists={paginatedArtists} />

                    {totalPages > 1 && (
                        <div className="mt-12 flex justify-center gap-2">
                            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50">← Précédent</button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-2 rounded-lg font-medium ${currentPage === i + 1 ? 'bg-amber-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>{i + 1}</button>
                            ))}

                            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50">Suivant →</button>
                        </div>
                    )}
                </div>
            </section>

            {/* Projets Section as iframe */}
            <section className="border-t border-gray-200 px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Projets & Initiatives</h2>
                    <iframe
                        src="/projets"
                        title="Projets institutionnels"
                        className="w-full border-2 border-gray-200 rounded-lg"
                        style={{ minHeight: '600px' }}
                    />
                </div>
            </section>

            {/* Submit CTA */}
            <section className="border-t border-gray-200 bg-amber-50 px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Vous êtes artiste?</h2>
                    <p className="mt-4 text-gray-600">Soumettez votre profil et travail pour être présenté dans notre répertoire institutional</p>
                    <a href="/artistes/soumettre" className="mt-6 inline-block bg-amber-600 px-8 py-3 rounded-lg font-semibold text-white hover:bg-amber-700 transition-colors">Soumettre mon profil</a>
                </div>
            </section>
        </div>
    );
}
