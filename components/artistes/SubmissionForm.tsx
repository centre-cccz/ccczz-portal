"use client"

import React, { useState } from 'react'
import { disciplineValues } from '../../lib/artistes/schema'

export default function SubmissionForm() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setMessage(null)
        setLoading(true)
        const form = e.target as HTMLFormElement
        const fd = new FormData(form)

        try {
            const res = await fetch('/api/artistes/submit', {
                method: 'POST',
                body: fd,
            })

            const json = await res.json()
            if (!res.ok) throw new Error(json?.message || 'Erreur serveur')
            setMessage('Merci — votre soumission a bien été reçue.')
            form.reset()
        } catch (err: any) {
            setMessage(err?.message || 'Erreur lors de la soumission')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Nom complet</label>
                <input name="name" required className="mt-1 w-full rounded border px-3 py-2" />
            </div>

            <div>
                <label className="block text-sm font-medium">Email</label>
                <input name="email" type="email" required className="mt-1 w-full rounded border px-3 py-2" />
            </div>

            <div>
                <label className="block text-sm font-medium">Téléphone (optionnel)</label>
                <input name="phone" className="mt-1 w-full rounded border px-3 py-2" />
            </div>

            <div>
                <label className="block text-sm font-medium">Disciplines (max 3)</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    {disciplineValues.map((d) => (
                        <label key={d} className="inline-flex items-center space-x-2">
                            <input type="checkbox" name="disciplines" value={d} />
                            <span className="text-sm">{d}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium">Biographie (min 50 caractères)</label>
                <textarea name="bio" minLength={50} required className="mt-1 w-full rounded border px-3 py-2" />
            </div>

            <div>
                <label className="block text-sm font-medium">Site web (optionnel)</label>
                <input name="website" className="mt-1 w-full rounded border px-3 py-2" />
            </div>

            <div>
                <label className="block text-sm font-medium">Photo de profil (optionnel)</label>
                <input name="profileImage" type="file" accept="image/*" className="mt-1" />
            </div>

            <div>
                <label className="block text-sm font-medium">Fichiers médias (images, vidéos, PDF) — au moins 1</label>
                <input name="mediaFiles" type="file" multiple className="mt-1" />
            </div>

            <div className="flex items-center space-x-2">
                <input name="agreeToTerms" type="checkbox" required />
                <label className="text-sm">J'accepte les conditions d'utilisation</label>
            </div>

            <div>
                <button type="submit" disabled={loading} className="rounded bg-blue-600 text-white px-4 py-2">
                    {loading ? 'Envoi…' : "Soumettre l'artiste"}
                </button>
            </div>

            {message && <div className="text-sm mt-2">{message}</div>}
        </form>
    )
}
