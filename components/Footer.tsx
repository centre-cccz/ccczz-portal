import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="site-footer bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="brand mb-4 flex items-center gap-3">
              <Image
                src="/logos/logo_cccz.svg"
                alt="Centre Culturel Congolais Le Zoo"
                width={48}
                height={48}
                className="footer-logo"
              />
              <div>
                <div className="brand-title font-bold text-lg text-white">Centre Culturel</div>
                <div className="brand-subtitle text-sm text-gray-400">Congolais Le Zoo</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Institution culturelle dédiée à la valorisation des patrimoines,
              à la création artistique et à la transmission des savoirs.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="footer-links">
            <h3 className="font-bold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition">Accueil</Link></li>
              <li><Link href="/evenements" className="text-gray-400 hover:text-white transition">Événements</Link></li>
              <li><Link href="/partnerships" className="text-gray-400 hover:text-white transition">Partenaires</Link></li>
              <li><Link href="/galerie" className="text-gray-400 hover:text-white transition">Galerie</Link></li>
              <li><Link href="/espaces" className="text-gray-400 hover:text-white transition">Espaces</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="footer-contact">
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <div className="space-y-3 text-gray-400 text-sm">
              <p className="font-semibold text-white">Centre Culturel Congolais Le Zoo</p>
              <p>Kinshasa, République Démocratique du Congo</p>
              <p>
                <a href="tel:+243818259999" className="hover:text-white transition font-semibold">
                  📞 +243 81 82 59 999
                </a>
              </p>
              <p>
                <a href="mailto:contact@ccclezoo.cd" className="hover:text-white transition">
                  contact@ccclezoo.cd
                </a>
              </p>
            </div>
          </div>

          {/* Social Media & Legal */}
          <div className="footer-social">
            <h3 className="font-bold text-lg mb-4">Nous Suivre</h3>
            <div className="flex gap-4 mb-6">
              <a
                href="https://facebook.com/cccz"
                target="_blank"
                rel="noopener noreferrer"
                className="icon-wrapper"
                title="Facebook"
                aria-label="Facebook"
              >
                <svg className="icon" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <rect width="256" height="256" rx="48" fill="var(--icon-bg, #1877F2)" />
                  <path d="M163 96h-18c-1.6 0-4 1-4 4v18h22l-3 24h-19v60h-26v-60h-16v-24h16v-16c0-19 11-32 34-32h22v24z" fill="#fff" />
                </svg>
              </a>

              <a
                href="https://instagram.com/cccz"
                target="_blank"
                rel="noopener noreferrer"
                className="icon-wrapper"
                title="Instagram"
                aria-label="Instagram"
              >
                <svg className="icon" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <rect width="256" height="256" rx="48" fill="url(#iggrad)" />
                  <defs>
                    <linearGradient id="iggrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#f58529" />
                      <stop offset="0.5" stopColor="#dd2a7b" />
                      <stop offset="1" stopColor="#8134af" />
                    </linearGradient>
                  </defs>
                  <path d="M168 88a40 40 0 1 0-80 0 40 40 0 0 0 80 0z" fill="#fff" />
                  <circle cx="184" cy="72" r="10" fill="#fff" />
                </svg>
              </a>

              <a
                href="https://youtube.com/cccz"
                target="_blank"
                rel="noopener noreferrer"
                className="icon-wrapper"
                title="YouTube"
                aria-label="YouTube"
              >
                <svg className="icon" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <rect width="256" height="256" rx="48" fill="#FF0000" />
                  <path d="M164 128l-56 32V96l56 32z" fill="#fff" />
                </svg>
              </a>

              <a
                href="https://twitter.com/cccz"
                target="_blank"
                rel="noopener noreferrer"
                className="icon-wrapper"
                title="X"
                aria-label="X"
              >
                <svg className="icon" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <rect width="256" height="256" rx="48" fill="#1DA1F2" />
                  <path d="M185 84l-34 44 34 44h-28l-22-28-22 28h-28l34-44-34-44h28l22 28 22-28h28z" fill="#fff" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="footer-legal text-gray-400 text-sm mb-4 md:mb-0">
            <p>© 2026 CCCZ — Tous droits réservés.</p>
            <p>Portail officiel du Centre Culturel Congolais Le Zoo.</p>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition">Politique de Confidentialité</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Mentions Légales</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
