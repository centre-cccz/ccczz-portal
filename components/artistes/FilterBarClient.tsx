'use client';

import React, { useState } from 'react';
import { Artist, ArtistMedia, disciplineLabels } from '@/lib/artistes/schema';
import FilterBar from './FilterBar';
import ArtistGrid from './ArtistGrid';

interface FilterBarClientProps {
    artists: (Artist & { mediaItems: ArtistMedia[] })[];
}

/**
 * Client wrapper for interactive filter directory
 */
export function FilterBarClient({ artists }: FilterBarClientProps) {
    const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Filter artists
    const filteredArtists = selectedDisciplines.length === 0
        ? artists
        : artists.filter((artist) =>
            artist.disciplines.some((d) =>
                selectedDisciplines.includes(d)
            )
        );

    const totalPages = Math.ceil(filteredArtists.length / itemsPerPage);
    const paginatedArtists = filteredArtists.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleFilterChange = (filters: { disciplines: string[] }) => {
        setSelectedDisciplines(filters.disciplines);
        setCurrentPage(1);
    };

    return (
        <>
            <FilterBar
                onFilterChange={handleFilterChange}
                selectedDisciplines={selectedDisciplines}
            />

            <div className="px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {selectedDisciplines.length > 0
                                ? `Artistes en ${selectedDisciplines.map((d) => disciplineLabels[d as any]).join(', ')}`
                                : 'Répertoire des artistes'}
                        </h2>
                        <p className="mt-2 text-gray-600">
                            {filteredArtists.length} artiste(s) trouvé(s)
                        </p>
                    </div>

                    {filteredArtists.length > 0 ? (
                        <>
                            <ArtistGrid artists={paginatedArtists} />

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-12 flex justify-center gap-2 flex-wrap">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        ← Précédent
                                    </button>

                                    {[...Array(totalPages)].map((_, i) => {
                                        const page = i + 1;
                                        if (
                                            Math.abs(page - currentPage) <= 1 ||
                                            page === 1 ||
                                            page === totalPages
                                        ) {
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`px-3 py-2 rounded-lg font-medium ${currentPage === page
                                                            ? 'bg-amber-600 text-white'
                                                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        } else if (
                                            Math.abs(page - currentPage) === 2 &&
                                            page < currentPage
                                        ) {
                                            return (
                                                <span key={page} className="px-2 py-2">
                                                    ...
                                                </span>
                                            );
                                        }
                                        return null;
                                    })}

                                    <button
                                        onClick={() =>
                                            setCurrentPage(Math.min(totalPages, currentPage + 1))
                                        }
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Suivant →
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600">
                                Aucun artiste trouvé avec les filtres sélectionnés
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default FilterBarClient;
