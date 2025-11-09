"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Cookie } from 'lucide-react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fermé le bandeau
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Afficher le bandeau après un court délai
      setTimeout(() => {
        setShowBanner(true);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <Cookie className="h-6 w-6 text-[#B6D7A5]" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Utilisation des cookies
            </h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Ce site utilise uniquement des <strong>cookies strictement nécessaires</strong> au
              fonctionnement du site (paiement sécurisé via Stripe, réservations). Aucun cookie
              de suivi, publicitaire ou d'analyse n'est utilisé. Ces cookies essentiels ne
              nécessitent pas de consentement préalable conformément à la réglementation.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <Button
                onClick={handleAccept}
                className="bg-[#B6D7A5] text-black hover:bg-[#B6D7A5]/90 font-semibold"
              >
                J'ai compris
              </Button>

              <a
                href="/politique-cookies"
                className="text-sm text-[#B6D7A5] hover:underline font-medium"
              >
                En savoir plus sur notre politique de cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
