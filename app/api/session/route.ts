import { NextResponse } from "next/server";
import Stripe from "stripe";

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-10-29.clover",
  });
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID manquant" },
        { status: 400 }
      );
    }

    const stripe = getStripe();

    // Récupérer les détails de la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || !session.metadata) {
      return NextResponse.json(
        { error: "Session non trouvée" },
        { status: 404 }
      );
    }

    // Extraire les informations de la metadata
    const bookingDetails = {
      firstName: session.metadata.firstName,
      lastName: session.metadata.lastName,
      email: session.metadata.email,
      phone: session.metadata.phone,
      date: session.metadata.date,
      startTime: session.metadata.startTime,
      participantsCount: parseInt(session.metadata.participantsCount),
      totalAmount: (session.amount_total || 0) / 100, // Convertir de centimes en euros
    };

    return NextResponse.json(bookingDetails);
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Erreur lors de la récupération de la session:", error);
    return NextResponse.json(
      { error: error.message || "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
