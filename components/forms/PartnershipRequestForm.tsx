'use client';

import React, { useState } from 'react';
import { validatePartnership } from '@/lib/validation/partnership';

export default function PartnershipRequestForm() {
    const [formData, setFormData] = useState({
        organizationName: '',
        organizationType: 'institutional',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        description: '',
        interestedAreas: [] as string[],
        proposedPartnership: '',
        message: '',
    });

    const [errors, setErrors] = useState<any>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const organizationTypes = [
        { value: 'institutional', label: '🏛️ Institutionnel' },
        { value: 'cultural', label: '🎨 Culturel' },
        { value: 'commercial', label: '💼 Commercial' },
        { value: 'educational', label: '📚 Académique' },
        { value: 'other', label: '❓ Autre' },
    ];

    const interestedAreasOptions = [
        'Événements',
        'Formations',
        'Expositions',
        'Coopération',
        'Sponsoring',
        'Média',
        'Recherche',
        'Développement',
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear error for this field
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleCheckboxChange = (area: string) => {
        setFormData({
            ...formData,
            interestedAreas: formData.interestedAreas.includes(area)
                ? formData.interestedAreas.filter((a) => a !== area)
                : [...formData.interestedAreas, area],
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validation
        const newErrors: any = {};

        if (!formData.organizationName?.trim()) {
            newErrors.organizationName = 'Le nom de l\'organisation est requis';
        }
        if (!formData.contactName?.trim()) {
            newErrors.contactName = 'Votre nom est requis';
        }
        if (!formData.contactEmail?.trim()) {
            newErrors.contactEmail = 'L\'email est requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
            newErrors.contactEmail = 'Email invalide';
        }
        if (!formData.description?.trim()) {
            newErrors.description = 'La description de votre organisation est requise';
        }
        if (formData.interestedAreas.length === 0) {
            newErrors.interestedAreas = 'Sélectionnez au moins un domaine d\'intérêt';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        // Simulate form submission
        try {
            // In production, send to your API
            console.log('Partnership request:', formData);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setSubmitted(true);
            setFormData({
                organizationName: '',
                organizationType: 'institutional',
                contactName: '',
                contactEmail: '',
                contactPhone: '',
                website: '',
                description: '',
                interestedAreas: [],
                proposedPartnership: '',
                message: '',
            });

            // Reset success message after 5 seconds
            setTimeout(() => setSubmitted(false), 5000);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Demande de Partenariat</h2>
            <p className="text-gray-600 mb-8">
                Remplissez ce formulaire pour exprimer votre intérêt de collaboration avec le CCCZ.
            </p>

            {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">
                        ✓ Merci pour votre demande ! Nous vous contacterons dans les meilleurs délais.
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Organization Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">Informations de l'organisation</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom de l'organisation *
                        </label>
                        <input
                            type="text"
                            name="organizationName"
                            value={formData.organizationName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent ${errors.organizationName ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Exemple : Fondation Pour l'Afrique"
                        />
                        {errors.organizationName && <p className="text-red-600 text-xs mt-1">{errors.organizationName}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type d'organisation *</label>
                        <select
                            name="organizationType"
                            value={formData.organizationType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
                        >
                            {organizationTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description de votre organisation *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Décrivez votre organisation, ses missions et ses activités..."
                        />
                        {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
                        <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
                            placeholder="https://exemple.com"
                        />
                    </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-bold text-gray-900">Informations de contact</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
                        <input
                            type="text"
                            name="contactName"
                            value={formData.contactName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent ${errors.contactName ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Votre nom"
                        />
                        {errors.contactName && <p className="text-red-600 text-xs mt-1">{errors.contactName}</p>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={formData.contactEmail}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="votre@email.com"
                            />
                            {errors.contactEmail && <p className="text-red-600 text-xs mt-1">{errors.contactEmail}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                            <input
                                type="tel"
                                name="contactPhone"
                                value={formData.contactPhone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
                                placeholder="+243 123 456 789"
                            />
                        </div>
                    </div>
                </div>

                {/* Partnership Interests */}
                <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-bold text-gray-900">Domaines d'intérêt *</h3>
                    <p className="text-gray-600 text-sm">Sélectionnez les domaines de partenariat qui vous intéressent</p>

                    <div className="grid md:grid-cols-2 gap-4">
                        {interestedAreasOptions.map((area) => (
                            <label key={area} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.interestedAreas.includes(area)}
                                    onChange={() => handleCheckboxChange(area)}
                                    className="w-4 h-4 text-green-700 rounded focus:ring-2 focus:ring-green-700"
                                />
                                <span className="text-gray-700">{area}</span>
                            </label>
                        ))}
                    </div>
                    {errors.interestedAreas && <p className="text-red-600 text-xs mt-1">{errors.interestedAreas}</p>}
                </div>

                {/* Partnership Proposal */}
                <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-bold text-gray-900">Proposition de partenariat</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Décrivez le type de partenariat souhaité
                        </label>
                        <textarea
                            name="proposedPartnership"
                            value={formData.proposedPartnership}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
                            placeholder="Sponsoring • Collaboration projet • Partenariat stratégique • Autre..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message additionnel</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
                            placeholder="Ajoutez toute information supplémentaire..."
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-6 border-t">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-green-700 text-white font-bold rounded-lg hover:bg-green-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
                    </button>
                    <button
                        type="reset"
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:border-gray-400 transition"
                    >
                        Réinitialiser
                    </button>
                </div>
            </form>

            <p className="text-xs text-gray-500 mt-6 text-center">
                * Champs obligatoires | Nous traiterons votre demande dans les 5 jours ouvrables.
            </p>
        </div>
    );
}
