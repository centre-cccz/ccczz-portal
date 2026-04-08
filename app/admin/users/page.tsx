'use client';

import { useState } from 'react';
import Link from 'next/link';

const ROLES = [
    { value: 'ROLE_DACPA', label: 'DACPA - Animation Culturelle' },
    { value: 'ROLE_FINANCE', label: 'Finance' },
    { value: 'ROLE_DG', label: 'Direction Générale' },
    { value: 'ROLE_BIBLIOTHEQUE', label: 'Bibliothèque' },
    { value: 'ROLE_ADMIN', label: 'Administrateur' },
];

const DIRECTIONS = [
    { value: 'DACPA', label: 'Animation Culturelle & Programmation' },
    { value: 'FINANCES', label: 'Finances' },
    { value: 'BIBLIOTHEQUE', label: 'Bibliothèque' },
    { value: 'INTENDANCE', label: 'Intendance' },
];

export default function AdminUsersPage() {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('ROLE_DACPA');
    const [direction, setDirection] = useState('DACPA');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            if (!email || !fullName || !password) {
                throw new Error('Email, nom complet et mot de passe sont requis.');
            }

            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    fullName,
                    password,
                    role,
                    direction,
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || 'Erreur lors de la création du compte.');
            }

            setMessage(`Compte créé avec succès (ID: ${data.userId}).`);
            setEmail('');
            setFullName('');
            setPassword('');
        } catch (err: any) {
            setError(err?.message || 'Erreur inattendue.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Créer un compte gestionnaire</h1>
                    <p className="text-gray-600 mb-6">
                        Créez un compte pour un agent ou un directeur qui doit gérer le contenu et les opérations.
                    </p>

                    {message && (
                        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-800 px-4 py-3">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                Nom complet
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-500 focus:ring-amber-500"
                                placeholder="Nom Prénom"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-500 focus:ring-amber-500"
                                placeholder="utilisateur@cccz.cd"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-500 focus:ring-amber-500"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                    Rôle
                                </label>
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-500 focus:ring-amber-500"
                                >
                                    {ROLES.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="direction" className="block text-sm font-medium text-gray-700 mb-1">
                                    Direction
                                </label>
                                <select
                                    id="direction"
                                    value={direction}
                                    onChange={(e) => setDirection(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-500 focus:ring-amber-500"
                                >
                                    {DIRECTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-6 py-3 text-white hover:bg-amber-700 disabled:bg-gray-400"
                        >
                            {loading ? 'Création en cours…' : 'Créer le compte'}
                        </button>
                    </form>

                    <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                        <p className="font-semibold mb-2">Note</p>
                        <p>
                            Le compte sera créé dans la base de données des gestionnaires. Seuls les rôles DG et Admin pourront ensuite attribuer
                            des accès à d'autres directions.
                        </p>
                    </div>

                    <div className="mt-6">
                        <Link href="/admin/dashboard" className="inline-block bg-gray-100 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200">
                            Retour au dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
