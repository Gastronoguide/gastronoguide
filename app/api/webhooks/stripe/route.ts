import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendConfirmationEmail, sendOwnerSMS } from "@/lib/brevo";

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-10-29.clover",
  });
};

const getEndpointSecret = () => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }
  return process.env.STRIPE_WEBHOOK_SECRET;
};

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    const endpointSecret = getEndpointSecret();
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
  } catch (err: unknown) {
    const error = err as Error;
    console.error("❌ Erreur de vérification du webhook:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("📥 Webhook reçu - checkout.session.completed");
        console.log("📋 Metadata reçues:", JSON.stringify(session.metadata, null, 2));

        const metadata = session.metadata || {};

        // Validation des données requises
        if (!metadata.date || !metadata.startTime || !metadata.email) {
          console.error("❌ Données manquantes:", {
            date: metadata.date,
            startTime: metadata.startTime,
            email: metadata.email
          });
          throw new Error("Metadata incomplètes: date, startTime ou email manquant");
        }

        const participantsCount = parseInt(metadata.participantsCount || "1");

        // Parsing de la date et heure avec logging
        console.log("🕐 Parsing des données:", {
          date: metadata.date,
          startTime: metadata.startTime
        });

        // Extraire l'heure de début si c'est une plage horaire (ex: "09:00 - 11:00" -> "09:00")
        const startTimeString = metadata.startTime.split(' - ')[0].trim();

        const date = new Date(metadata.date);
        const startTime = new Date(`${metadata.date}T${startTimeString}:00`);

        console.log("📅 Dates créées:", {
          date: date.toISOString(),
          startTime: startTime.toISOString(),
          dateValid: !isNaN(date.getTime()),
          startTimeValid: !isNaN(startTime.getTime())
        });

        // Vérifier que les dates sont valides
        if (isNaN(date.getTime()) || isNaN(startTime.getTime())) {
          console.error("❌ Dates invalides générées");
          throw new Error("Dates invalides après parsing");
        }

        console.log("💾 Tentative d'enregistrement en BDD avec:", {
          date,
          startTime,
          participantCount: participantsCount,
          firstName: metadata.firstName,
          lastName: metadata.lastName,
          email: metadata.email,
          phone: metadata.phone,
        });

        await db.appointment.create({
          data: {
            date,
            startTime,
            participantCount: participantsCount,
            firstName: metadata.firstName || "",
            lastName: metadata.lastName || "",
            email: metadata.email || "",
            phone: metadata.phone || "",
          },
        });

        console.log("✅ Appointment enregistré en BDD avec succès:", metadata.email);

        // Envoi de l'email de confirmation au client
        try {
          await sendConfirmationEmail({
            firstName: metadata.firstName || "",
            lastName: metadata.lastName || "",
            email: metadata.email || "",
            phone: metadata.phone || "",
            date: metadata.date,
            startTime: metadata.startTime,
            participantsCount,
          });
          console.log("✅ Email de confirmation envoyé au client");
        } catch (emailError) {
          console.error("⚠️ Erreur lors de l'envoi de l'email au client:", emailError);
          // On continue même si l'email échoue
        }

        // Envoi du SMS de notification au propriétaire
        try {
          await sendOwnerSMS({
            firstName: metadata.firstName || "",
            lastName: metadata.lastName || "",
            email: metadata.email || "",
            phone: metadata.phone || "",
            date: metadata.date,
            startTime: metadata.startTime,
            participantsCount,
          });
          console.log("✅ SMS de notification envoyé au propriétaire");
        } catch (smsError) {
          console.error("⚠️ Erreur lors de l'envoi du SMS au propriétaire:", smsError);
          // On continue même si le SMS échoue
        }

        break;

      default:
        console.log(`ℹ️ Événement non géré: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("❌ Erreur lors de l'enregistrement en BDD:", error);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}
