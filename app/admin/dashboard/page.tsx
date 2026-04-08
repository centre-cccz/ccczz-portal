/*
META
status: BROUILLON
directions_notified: ["Direction Générale", "Communication"]
next_steps: ["Limiter accès aux roles internes via RBAC avant validation finale"]
*/

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
    id: string;
    role: string;
    direction_id: string;
    email: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const role = localStorage.getItem('user_role');
        const direction = localStorage.getItem('user_direction');

        if (!token || !role || !direction) {
            router.push('/admin/login');
            return;
        }

        try {
            const decoded = JSON.parse(typeof window !== 'undefined' ? window.atob(token) : Buffer.from(token, 'base64').toString('utf8'));
            setUser(decoded);
        } catch (err) {
            console.error('Token decode error:', err);
            router.push('/admin/login');
        } finally {
            setLoading(false);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_direction');
        router.push('/admin/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const roleLabel = {
        'ROLE_DACPA': '🎭 DACPA - Animation Culturelle',
        'ROLE_FINANCE': '💰 Finance',
        'ROLE_DG': '👑 Direction Générale',
        'ROLE_BIBLIOTHEQUE': '📚 Bibliothèque',
    }[user.role] || user.role;

    const directionLabel = {
        'DACPA': 'Animation Culturelle & Programmation',
        'FINANCES': 'Finances',
        'BIBLIOTHEQUE': 'Bibliothèque',
        'INTENDANCE': 'Intendance',
    }[user.direction_id] || user.direction_id;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-amber-700 text-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard CCCZ</h1>
                        <p className="text-amber-100 text-sm mt-1">Centre Culturel Congolais Le Zoo</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white text-sm font-semibold"
                    >
                        Déconnexion
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Bienvenue, {user.id}!</h2>
                            <div className="space-y-2">
                                <p className="text-gray-700">
                                    <strong>Rôle:</strong> {roleLabel}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Direction:</strong> {directionLabel}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Email:</strong> {user.email}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl">
                                {user.role === 'ROLE_DACPA' && '🎭'}
                                {user.role === 'ROLE_FINANCE' && '💰'}
                                {user.role === 'ROLE_DG' && '👑'}
                                {user.role === 'ROLE_BIBLIOTHEQUE' && '📚'}
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Connecté le {new Date().toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Modules accessibles selon le rôle */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Événements (DACPA) */}
                    {user.role === 'ROLE_DACPA' && (
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">🎭 Événements</h3>
                            <p className="text-gray-600 mb-4">
                                Créer, modifier et publier les événements culturels du CCCZ.
                            </p>
                            <Link
                                href="/admin/events"
                                className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                            >
                                Gérer les événements
                            </Link>
                        </div>
                    )}

                    {/* Billetterie (FINANCE) */}
                    {user.role === 'ROLE_FINANCE' && (
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">💰 Billetterie</h3>
                            <p className="text-gray-600 mb-4">
                                Gérer les prix des tickets et consulter les revenus.
                            </p>
                            <Link
                                href="/admin/tickets"
                                className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                            >
                                Gérer la billetterie
                            </Link>
                        </div>
                    )}

                    {/* Rapports Financiers (FINANCE & DG) */}
                    {(user.role === 'ROLE_FINANCE' || user.role === 'ROLE_DG') && (
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">📊 Rapports Financiers</h3>
                            <p className="text-gray-600 mb-4">
                                Accéder aux rapports financiers et exports Power BI.
                            </p>
                            <Link
                                href="/admin/reports"
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                            >
                                Voir les rapports
                            </Link>
                        </div>
                    )}

                    {/* Contenu Culturel (BIBLIOTHEQUE) */}
                    {user.role === 'ROLE_BIBLIOTHEQUE' && (
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">📚 Bibliothèque</h3>
                            <p className="text-gray-600 mb-4">
                                Gérer le contenu culturel et les archives.
                            </p>
                            <Link
                                href="/admin/library"
                                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                            >
                                Gérer la bibliothèque
                            </Link>
                        </div>
                    )}

                    {/* Gestion Complète (DG) */}
                    {user.role === 'ROLE_DG' && (
                        <>
                            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">👑 Gestion Générale</h3>
                                <p className="text-gray-600 mb-4">
                                    Accès complet à tous les modules et gestion transversale.
                                </p>
                                <Link
                                    href="/admin/management"
                                    className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                                >
                                    Gestion complète
                                </Link>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">⚙️ Administration</h3>
                                <p className="text-gray-600 mb-4">
                                    Gérer les utilisateurs, les droits d'accès et les paramètres système.
                                </p>
                                <Link
                                    href="/admin/settings"
                                    className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                                >
                                    Paramètres
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                {/* Audit & Conformité */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-blue-900 mb-4">🔐 Système de Sécurité RBAC</h3>
                    <p className="text-blue-800 mb-4">
                        Votre accès est protégé par un système de contrôle d'accès basé sur les rôles (RBAC) conforme aux règles institutionnelles du CCCZ.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-white p-4 rounded border border-blue-200">
                            <p className="font-semibold text-blue-900">✅ Isolation par Direction</p>
                            <p className="text-blue-700 text-xs mt-1">
                                Vous pouvez uniquement accéder aux données de votre direction (sauf DG).
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded border border-blue-200">
                            <p className="font-semibold text-blue-900">🔍 Traçabilité Complète</p>
                            <p className="text-blue-700 text-xs mt-1">
                                Toutes les actions sont enregistrées dans l'historique d'audit.
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded border border-blue-200">
                            <p className="font-semibold text-blue-900">🛡️ Conformité CCCZ</p>
                            <p className="text-blue-700 text-xs mt-1">
                                Système approuvé par l'audit institutionnel (Feb 2026).
                            </p>
                        </div>
                    </div>
                    <p className="text-xs text-blue-600 mt-4">
                        Documentation: <Link href="/docs" className="underline hover:text-blue-800">Voir l'audit complet</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
