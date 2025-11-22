import React from 'react';

export default function PolitiqueConfidentialite() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Politique de Confidentialité (RGPD)</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-gray-600 mb-8">Dernière mise à jour : 9 Novembre 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 1 – Responsable du traitement</h2>
          <p className="mb-4">
            Le responsable du traitement des données est Jean-Baptiste ALDEBERT, gérant de
            GASTRONOGUIDE.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 2 – Données collectées</h2>
          <p className="mb-4">
            Les données collectées incluent : nom, prénom, adresse e-mail, téléphone, date et heure de rendez-vous et le nombre de participants. Les informations de paiement (numéro de carte bancaire, date d'expiration, cryptogramme) sont collectées et traitées directement par notre prestataire de paiement Stripe Inc.,
            certifié PCI-DSS niveau 1. GASTRONOGUIDE n'a pas accès aux données bancaires complètes et ne les stocke pas sur ses serveurs.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 3 – Finalité du traitement</h2>
          <p className="mb-4">
            Les données personnelles sont collectées pour la gestion des réservations, le suivi client, la
            communication relative aux prestations réservées et la notification du gestionnaire par SMS lors de nouvelles réservations (le gestionnaire reçoit les coordonnées du client pour assurer le suivi).
          </p>
          <p className="mb-4">
            Aucune donnée n'est cédée ou vendue à des tiers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 4 – Droits des utilisateurs</h2>
          <p className="mb-4">
            Conformément au RGPD (UE 2016/679), tout utilisateur dispose d'un droit d'accès, de rectification,de suppression et de portabilité de ses données. Toute demande peut être adressée à gastronoguide@gmail.com.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 6 – Sous-traitants</h2>
          <p className="mb-4">
            GASTRONOGUIDE fait appel aux sous-traitants suivants, tous conformes au RGPD :
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Stripe Inc. (traitement des paiements) - certifié PCI-DSS niveau 1</li>
            <li>Vercel Inc. (hébergement du site web)</li>
            <li>Supabase Inc. (base de données)</li>
            <li>Brevo (anciennement Sendinblue) - envoi d'emails transactionnels et SMS de notification</li>
          </ul>
          <p className="mb-4">
            Ces sous-traitants sont soumis aux mêmes obligations de protection des données personnelles.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 7 – Sécurité</h2>
          <p className="mb-4">
            Les données sont stockées sur des serveurs sécurisés (Vercel et Supabase). Les paiements sont gérés via Stripe, conforme PCI-DSS. Les communications par email et SMS sont gérées via Brevo, conforme RGPD.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 8 – Cookies et traceurs</h2>
          <p className="mb-4">
            Voir la politique spécifique ci-dessous.
          </p>
        </section>
      </div>
    </div>
  );
}
