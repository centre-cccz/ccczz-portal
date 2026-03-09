'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DirectionLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('ROLE_DACPA');
    const [direction, setDirection] = useState('DACPA');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const ROLES = [
        { value: 'ROLE_DACPA', label: 'DACPA - Animation Culturelle' },
        { value: 'ROLE_FINANCE', label: 'Finance' },
        { value: 'ROLE_DG', label: 'Direction Générale' },
        { value: 'ROLE_BIBLIOTHEQUE', label: 'Bibliothèque' },
    ];

    const DIRECTIONS = [
        { value: 'DACPA', label: 'Animation Culturelle & Programmation' },
        { value: 'FINANCES', label: 'Finances' },
        { value: 'BIBLIOTHEQUE', label: 'Bibliothèque' },
        { value: 'INTENDANCE', label: 'Intendance' },
    ];

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validation basique
            if (!email || !password) {
                throw new Error('Email et mot de passe requis');
            }

            // Générer un token JWT simplifié (en base64)
            const token = Buffer.from(JSON.stringify({
                id: email.split('@')[0],
                role,
                direction_id: direction,
                email,
            })).toString('base64');

            // Stocker le token
            localStorage.setItem('auth_token', token);
            localStorage.setItem('user_role', role);
            localStorage.setItem('user_direction', direction);

            // Rediriger vers le dashboard
            router.push('/admin/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-900 to-amber-700 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">CCCZ</h1>
                    <p className="text-amber-100">Centre Culturel Congolais Le Zoo</p>
                    <p className="text-amber-200 text-sm mt-2">Accès Direction</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Connexion Direction</h2>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="utilisateur@cccz.cd"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Mot de passe */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Rôle */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                Rôle
                            </label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            >
                                {ROLES.map((r) => (
                                    <option key={r.value} value={r.value}>
                                        {r.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Direction */}
                        <div>
                            <label htmlFor="direction" className="block text-sm font-medium text-gray-700 mb-1">
                                Direction
                            </label>
                            <select
                                id="direction"
                                value={direction}
                                onChange={(e) => setDirection(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            >
                                {DIRECTIONS.map((d) => (
                                    <option key={d.value} value={d.value}>
                                        {d.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Bouton Connexion */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-6"
                        >
                            {loading ? 'Connexion en cours...' : 'Se Connecter'}
                        </button>
                    </form>

                    {/* Informations Demo */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-3 font-semibold">Comptes de test disponibles:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                            <li>• DACPA: dacpa@cccz.cd / password</li>
                            <li>• Finance: finance@cccz.cd / password</li>
                            <li>• DG: dg@cccz.cd / password</li>
                            <li>• Biblio: biblio@cccz.cd / password</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-amber-100 text-sm">
                    <p>Système de Gestion RBAC du CCCZ</p>
                    <p>© 2026 Centre Culturel Congolais Le Zoo</p>
                </div>
            </div>
        </div>
    );
}
