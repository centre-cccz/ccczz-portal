'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryItem } from '@/lib/mock-data/gallery';

interface GalleryModalProps {
    item: GalleryItem | null;
    isOpen: boolean;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    currentIndex: number;
    totalItems: number;
}

export default function GalleryModal({
    item,
    isOpen,
    onClose,
    onNext,
    onPrev,
    currentIndex,
    totalItems,
}: GalleryModalProps) {
    // Handle keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowRight':
                    onNext();
                    break;
                case 'ArrowLeft':
                    onPrev();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose, onNext, onPrev]);

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: 'spring',
                damping: 30,
                stiffness: 300,
            },
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.2 },
        },
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.1,
                duration: 0.3,
            },
        },
    };

    const buttonHoverVariants = {
        hover: { scale: 1.1 },
        tap: { scale: 0.95 },
    };

    if (!item) return null;

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={onClose}
                >
                    {/* Modal Container */}
                    <motion.div
                        className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900 rounded-xl overflow-hidden shadow-2xl"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <motion.button
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-amber-600 rounded-full transition-colors duration-200"
                            onClick={onClose}
                            variants={buttonHoverVariants}
                            whileHover="hover"
                            whileTap="tap"
                            aria-label="Fermer"
                        >
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </motion.button>

                        {/* Navigation State */}
                        <motion.div
                            className="absolute top-4 left-4 z-10 bg-black/50 px-4 py-2 rounded-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <p className="text-sm text-amber-300 font-semibold">
                                {currentIndex + 1} / {totalItems}
                            </p>
                        </motion.div>

                        <div className="flex flex-col lg:flex-row h-full items-center">
                            {/* Image Section */}
                            <motion.div
                                className="relative w-full lg:w-2/3 h-96 lg:h-full bg-black flex items-center justify-center"
                                key={item.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Image
                                    src={item.image}
                                    alt={item.imageAlt}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 1024px) 100vw, 66vw"
                                    priority
                                />
                            </motion.div>

                            {/* Info Section */}
                            <motion.div
                                className="w-full lg:w-1/3 p-6 lg:p-8 bg-slate-950 overflow-y-auto max-h-96 lg:max-h-full flex flex-col justify-between"
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {/* Content */}
                                <div className="space-y-6">
                                    {/* Title and Artist */}
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-2">
                                            {item.title}
                                        </h2>
                                        <p className="text-amber-400 font-semibold text-lg">{item.artist}</p>
                                    </div>

                                    {/* Year and Medium */}
                                    <div className="space-y-2 text-sm text-gray-300">
                                        <p>
                                            <span className="text-amber-300 font-semibold">Année:</span>{' '}
                                            {item.year}
                                        </p>
                                        {item.medium && (
                                            <p>
                                                <span className="text-amber-300 font-semibold">Médium:</span>{' '}
                                                {item.medium}
                                            </p>
                                        )}
                                        {item.dimensions && (
                                            <p>
                                                <span className="text-amber-300 font-semibold">Format:</span>{' '}
                                                {item.dimensions}
                                            </p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <h3 className="text-amber-300 font-semibold mb-2">Description</h3>
                                        <p className="text-gray-300 leading-relaxed text-sm lg:text-base">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Category Badge */}
                                    <div className="flex gap-2">
                                        <span className="inline-block bg-amber-600/20 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                            {item.category === 'graphique' && '🎨 Art Graphique'}
                                            {item.category === 'plastique' && '🗿 Art Plastique'}
                                            {item.category === 'musique' && '🎶 Art Musical'}
                                            {item.category === 'performance' && '🎭 Performance'}
                                        </span>
                                    </div>
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex gap-3 mt-8 pt-6 border-t border-slate-700">
                                    <motion.button
                                        onClick={onPrev}
                                        className="flex-1 py-3 px-4 bg-slate-700/50 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                        variants={buttonHoverVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        aria-label="Précédent"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 19l-7-7 7-7"
                                            />
                                        </svg>
                                        <span className="hidden sm:inline">Précédent</span>
                                    </motion.button>
                                    <motion.button
                                        onClick={onNext}
                                        className="flex-1 py-3 px-4 bg-amber-700 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                        variants={buttonHoverVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        aria-label="Suivant"
                                    >
                                        <span className="hidden sm:inline">Suivant</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </motion.button>
                                </div>

                                {/* Keyboard Hints */}
                                <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-gray-500 space-y-1">
                                    <p>⌨️ <span className="text-gray-400">Flèches</span> pour naviguer</p>
                                    <p>⌨️ <span className="text-gray-400">Esc</span> pour fermer</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Navigation Arrows - Desktop Only */}
                    <motion.button
                        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-amber-600 rounded-full transition-colors duration-200 z-10"
                        onClick={onPrev}
                        variants={buttonHoverVariants}
                        whileHover="hover"
                        whileTap="tap"
                        aria-label="Image précédente"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </motion.button>

                    <motion.button
                        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-amber-600 rounded-full transition-colors duration-200 z-10"
                        onClick={onNext}
                        variants={buttonHoverVariants}
                        whileHover="hover"
                        whileTap="tap"
                        aria-label="Image suivante"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
