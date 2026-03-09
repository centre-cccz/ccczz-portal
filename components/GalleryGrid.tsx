'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GalleryItem } from '@/lib/mock-data/gallery';

interface GalleryGridProps {
    items: GalleryItem[];
    onImageClick: (item: GalleryItem) => void;
    selectedCategory?: string | null;
    columns?: number;
}

export default function GalleryGrid({
    items,
    onImageClick,
    selectedCategory = null,
    columns = 3,
}: GalleryGridProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

    // Filter items based on selected category
    const filteredItems = useMemo(() => {
        if (!selectedCategory || selectedCategory === 'tous') return items;
        return items.filter((item) => item.category === selectedCategory);
    }, [items, selectedCategory]);

    const handleImageLoad = (id: string) => {
        setLoadedImages((prev) => new Set(prev).add(id));
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    const hoverVariants = {
        scale: 1.05,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.3 },
        },
    };

    // Responsive grid columns
    const gridColsClass = {
        2: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

    return (
        <motion.div
            className={`grid ${gridColsClass} gap-6 lg:gap-8`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {filteredItems.map((item) => (
                <motion.div
                    key={item.id}
                    className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
                    variants={itemVariants}
                    whileHover={hoverVariants}
                    onHoverStart={() => setHoveredId(item.id)}
                    onHoverEnd={() => setHoveredId(null)}
                    onClick={() => onImageClick(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            onImageClick(item);
                        }
                    }}
                >
                    {/* Image */}
                    <div className="relative w-full h-full bg-slate-900">
                        <Image
                            src={item.image}
                            alt={item.imageAlt}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            priority={item.featured}
                            onLoadingComplete={() => handleImageLoad(item.id)}
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Content Overlay */}
                        <motion.div
                            className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6"
                            variants={overlayVariants}
                            initial="hidden"
                            animate={hoveredId === item.id ? 'visible' : 'hidden'}
                        >
                            <div className="space-y-2">
                                <h3 className="text-lg sm:text-xl font-serif text-white font-bold leading-tight">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-amber-100/90 font-light">{item.artist}</p>
                                {item.medium && (
                                    <p className="text-xs text-amber-100/70 uppercase tracking-wider">
                                        {item.medium} • {item.year}
                                    </p>
                                )}
                            </div>
                        </motion.div>

                        {/* Featured Badge */}
                        {item.featured && (
                            <div className="absolute top-4 right-4 bg-amber-600/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                <p className="text-xs font-semibold text-white uppercase tracking-wider">
                                    ⭐ Sélection
                                </p>
                            </div>
                        )}

                        {/* Loading Skeleton */}
                        {!loadedImages.has(item.id) && (
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse" />
                        )}
                    </div>

                    {/* Hover Border Animation */}
                    <motion.div
                        className="absolute inset-0 border-2 border-amber-500/30 rounded-lg pointer-events-none"
                        animate={{
                            borderColor: hoveredId === item.id ? 'rgba(217, 119, 6, 0.6)' : 'rgba(217, 119, 6, 0)',
                        }}
                        transition={{ duration: 0.3 }}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
}
