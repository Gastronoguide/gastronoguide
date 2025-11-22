import React from 'react';

export default function PolitiqueCookies() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Politique des Cookies</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-gray-600 mb-8">Dernière mise à jour : 9 Novembre 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 1 – Définition</h2>
          <p className="mb-4">
            Un cookie est un petit fichier texte déposé sur l'appareil de l'utilisateur lors de sa visite du site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 2 – Cookies utilisés</h2>
          <p className="mb-4">
            Le site GASTRONOGUIDE utilise uniquement des cookies essentiels au fonctionnement du site (connexion, réservation, langue). Aucun cookie publicitaire ou de suivi n'est utilisé.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 3 – Consentement</h2>
          <p className="mb-4">
            Conformément à la réglementation, les cookies non essentiels nécessitent le consentement
            explicite de l'utilisateur. Aucun cookie de ce type n'est activé sur le site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 4 – Contact</h2>
          <p className="mb-4">
            Pour toute question relative à cette politique, l'utilisateur peut écrire à gastronoguide@gmail.com.
          </p>
        </section>
      </div>
    </div>
  );
}
