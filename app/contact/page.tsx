'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { validateContact } from '@/lib/validation/contact';
import DirectionCarousel from '@/components/DirectionCarousel';

type UserType = 'visitor' | 'partner' | 'artist';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  userType?: UserType;
  organizationName?: string;
  portfolio?: string;
}

export default function ContactPage() {
  const [userType, setUserType] = useState<UserType>('visitor');
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    userType: 'visitor',
  });
  const [errors, setErrors] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);

  const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserType(e.target.value as UserType);
    setFormData({
      ...formData,
      userType: e.target.value as UserType,
    });
    setErrors({});
    setSubmitted(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContact(formData);
    if (validation.valid) {
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        userType: userType,
        organizationName: '',
        portfolio: '',
      });
      setTimeout(() => setSubmitted(false), 5000);
    } else {
      setErrors(validation.errors);
    }
  };

  return (
    <>
      <section className="contact-hero py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
            <p className="text-xl text-gray-600">
              Que vous soyez visiteur, partenaire ou artiste, nous sommes là pour vous écouter.
            </p>
          </div>
        </div>
      </section>

      <section className="contact-content py-16">
        <div className="container mx-auto px-4">
          {/* Direction carousel inserted above the contact form */}
          <DirectionCarousel />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Infos de contact */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations</h2>

                {/* Logo CCCZ */}
                <div className="mb-6">
                  <Image
                    src="/logos/logo_cccz.svg"
                    alt="Logo CCCZ"
                    width={120}
                    height={120}
                    className="mb-4"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Centre Culturel Congolais</h3>
                    <p className="text-gray-600">Le Zoo</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Localisation</h3>
                    <p className="text-gray-600">Kinshasa, République Démocratique du Congo</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Téléphone</h3>
                    <p className="text-gray-600">
                      <a href="tel:+243818259999" className="hover:text-blue-600 transition">
                        +243 81 82 59 999
                      </a>
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">
                      <a href="mailto:contact@ccclezoo.cd" className="hover:text-blue-600 transition">
                        contact@ccclezoo.cd
                      </a>
                    </p>
                  </div>

                  {/* Logos réseaux sociaux */}
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="font-semibold text-gray-900 mb-4">Suivez-nous</h3>
                    <div className="flex gap-4">
                      <a href="https://facebook.com/cccz" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition">
                        <span className="text-2xl">f</span>
                      </a>
                      <a href="https://instagram.com/cccz" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800 transition">
                        <span className="text-2xl">📷</span>
                      </a>
                      <a href="https://youtube.com/cccz" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 transition">
                        <span className="text-2xl">▶</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire de contact */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-gray-900 mb-3">
                    Qui êtes-vous?
                  </label>
                  <select
                    value={userType}
                    onChange={handleUserTypeChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition font-semibold text-gray-900 bg-white cursor-pointer"
                  >
                    <option value="visitor">👤 Visiteur / Intéressé</option>
                    <option value="partner">🤝 Partenaire Commercial</option>
                    <option value="artist">🎭 Artiste / Créateur</option>
                  </select>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Votre nom"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="votre.email@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+243 XXXXXXXXX"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  {/* Champs conditionnels */}
                  {userType === 'partner' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Nom de l'organisation
                      </label>
                      <input
                        type="text"
                        name="organizationName"
                        value={formData.organizationName || ''}
                        onChange={handleInputChange}
                        placeholder="Nom de votre organisation"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>
                  )}

                  {userType === 'artist' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Lien vers votre portfolio
                      </label>
                      <input
                        type="url"
                        name="portfolio"
                        value={formData.portfolio || ''}
                        onChange={handleInputChange}
                        placeholder="https://portfolio.com"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Votre message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Parlez-nous de votre demande, projet ou question..."
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />
                    {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
                  </div>

                  {/* Message de succès */}
                  {submitted && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                      ✓ Merci ! Votre message a été reçu. Nous vous répondrons très bientôt.
                    </div>
                  )}

                  {/* Bouton submit */}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105"
                  >
                    Envoyer mon message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
