import React from 'react';

export default function MentionsLegales() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mentions légales</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-gray-600 mb-8">Dernière mise à jour : 9 Novembre 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 1 – Éditeur du site</h2>
          <p className="mb-4">
            Le site GASTRONOGUIDE est édité par Monsieur Jean-Baptiste ALDEBERT, micro-entrepreneur immatriculé sous le numéro SIRET 930 984 679 00017, dont le siège social est situé au 2886 route de Planques, 82370 Orgueil, France.
          </p>
          <p className="mb-4">
            Micro-entrepreneur bénéficiant de la franchise en base de TVA (article 293 B du CGI).
          </p>
          <p className="mb-4">
            Adresse de contact : gastronoguide@gmail.com.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 2 – Hébergement</h2>
          <p className="mb-4">
            Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 3 – Directeur de la publication</h2>
          <p className="mb-4">
            Monsieur Jean-Baptiste ALDEBERT, en qualité de responsable légal.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 4 – Propriété intellectuelle</h2>
          <p className="mb-4">
            L'ensemble du contenu présent sur le site (textes, photographies, logos, vidéos, illustrations, code source) est la propriété exclusive de GASTRONOGUIDE. Toute reproduction, diffusion, adaptation ou modification sans autorisation écrite préalable est strictement interdite.
          </p>
        </section>
      </div>
    </div>
  );
}
