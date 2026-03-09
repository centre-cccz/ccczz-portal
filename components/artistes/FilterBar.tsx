'use client';

import React, { useState, useCallback } from 'react';
import { disciplineLabels, Discipline, disciplineValues } from '@/lib/artistes/schema';

interface FilterBarProps {
    onFilterChange: (filters: { disciplines: string[] }) => void;
    selectedDisciplines: string[];
}

/**
 * Filter bar component for artist directory
 * Allows filtering by discipline
 */
export function FilterBar({
    onFilterChange,
    selectedDisciplines,
}: FilterBarProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDiscipline = useCallback(
        (discipline: string) => {
            const updated = selectedDisciplines.includes(discipline)
                ? selectedDisciplines.filter((d) => d !== discipline)
                : [...selectedDisciplines, discipline];

            onFilterChange({ disciplines: updated });
        },
        [selectedDisciplines, onFilterChange]
    );

    const clearFilters = useCallback(() => {
        onFilterChange({ disciplines: [] });
    }, [onFilterChange]);

    return (
        <div className="border-b border-gray-200 bg-white py-6 sticky top-0 z-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900">
                            Disciplines
                        </h2>
                        {selectedDisciplines.length > 0 && (
                            <p className="mt-1 text-xs text-gray-500">
                                {selectedDisciplines.length} sélectionné(e)(s)
                            </p>
                        )}
                    </div>

                    {/* Desktop Filters */}
                    <div className="hidden gap-2 flex-wrap md:flex">
                        {disciplineValues.map((discipline) => (
                            <button
                                key={discipline}
                                onClick={() => toggleDiscipline(discipline)}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${selectedDisciplines.includes(discipline)
                                        ? 'bg-amber-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {disciplineLabels[discipline as Discipline]}
                            </button>
                        ))}
                    </div>

                    {/* Mobile Dropdown */}
                    <div className="relative md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                />
                            </svg>
                            Filtrer
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
                                {disciplineValues.map((discipline) => (
                                    <label
                                        key={discipline}
                                        className="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3 hover:bg-gray-50 last:border-b-0"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedDisciplines.includes(discipline)}
                                            onChange={() => toggleDiscipline(discipline)}
                                            className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                            {disciplineLabels[discipline as Discipline]}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Clear Filters */}
                {selectedDisciplines.length > 0 && (
                    <div className="mt-4">
                        <button
                            onClick={clearFilters}
                            className="text-sm font-semibold text-amber-600 hover:text-amber-700"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FilterBar;
