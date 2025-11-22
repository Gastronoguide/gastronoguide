import React from 'react';

export default function ConditionsGeneralesVente() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Conditions Générales de Vente (CGV)</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-gray-600 mb-8">Dernière mise à jour : 9 Novembre 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 1 – Objet</h2>
          <p className="mb-4">
            Les présentes conditions générales de vente (CGV) ont pour objet de définir les droits et obligations des parties dans le cadre de la vente des prestations de visites gastronomiques proposées par GASTRONOGUIDE.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 2 – Prestations</h2>
          <p className="mb-4">
            GASTRONOGUIDE organise des visites gastronomiques du Marché Victor Hugo à Toulouse, incluant des dégustations chez des artisans partenaires. Durée moyenne : 2 heures. Langues disponibles : français, anglais, espagnol.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 3 – Réservation</h2>
          <p className="mb-4">
            Les réservations s'effectuent en ligne via le site GASTRONOGUIDE. Toute réservation n'est ferme et définitive qu'après confirmation par e-mail et réception du paiement intégral.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 4 – Tarifs et paiement</h2>
          <p className="mb-4">
            Les prix sont indiqués en euros toutes taxes comprises (TTC). Le règlement s'effectue
            exclusivement par carte bancaire via la plateforme sécurisée Stripe Inc. Les données bancaires sont traitées directement par Stripe et ne transitent pas par les serveurs de GASTRONOGUIDE.
          </p>
          <p className="mb-4">
            GASTRONOGUIDE se réserve le droit de modifier ses tarifs à tout moment.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 5 – Annulation et remboursement</h2>
          <p className="mb-4">
            Annulation effectuée plus de 48h avant la visite : remboursement intégral.
          </p>
          <p className="mb-4">
            Annulation effectuée entre 48h et 24h avant la visite : remboursement de 50 %.
          </p>
          <p className="mb-4">
            Annulation effectuée moins de 24h avant ou en cas de non-présentation : aucun remboursement. En cas d'annulation du fait de GASTRONOGUIDE (conditions météorologiques extrêmes, problème de santé, ou autre cas de force majeure), le client sera remboursé intégralement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 6 – Droit de rétractation</h2>
          <p className="mb-4">
            Conformément à l'article L221-28 du Code de la consommation, les prestations de services
            d'activités de loisirs fournies à une date déterminée ne bénéficient pas du droit de rétractation de 14 jours.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 7 – Responsabilité</h2>
          <p className="mb-4">
            Le client participe à la visite sous sa propre responsabilité. GASTRONOGUIDE ne peut être tenu responsable des dommages corporels, matériels ou immatériels survenant lors des visites, sauf faute avérée. Le client est tenu de respecter les règles de sécurité et les consignes données par le guide.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 8 – Force majeure</h2>
          <p className="mb-4">
            Aucune des parties ne pourra être tenue responsable d'un manquement dû à un événement de force majeure au sens de l'article 1218 du Code civil.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 9 – Médiation de la consommation</h2>
          <p className="mb-4">
            Conformément à l'article L612-1 du Code de la consommation, en cas de litige non résolu à l'amiable,le consommateur peut recourir gratuitement au médiateur : CM2C (https://www.cm2c.net).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 10 – Données personnelles</h2>
          <p className="mb-4">
            Les informations collectées lors des réservations sont nécessaires à leur traitement et à leur suivi. Ces données sont traitées conformément à la Politique de Confidentialité accessible sur le site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Article 11 – Droit applicable et juridiction compétente</h2>
          <p className="mb-4">
            Les présentes CGV sont soumises au droit français. Tout litige sera porté devant les tribunaux compétents de Toulouse.
          </p>
        </section>
      </div>
    </div>
  );
}
