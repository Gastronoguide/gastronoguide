import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      date,
      startTime,
      price,
      participantsCount,
    } = body;

    if (!email || !price || !date || !startTime) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Matinée Gastronomique - Marché Victor Hugo",
              description: `Réservation pour ${participantsCount} personne${
                participantsCount > 1 ? "s" : ""
              }\nDate: ${date}\nHeure: ${startTime}\nClient: ${firstName} ${lastName}\nTéléphone: ${phone}`,
            },
            unit_amount: Math.round((price / participantsCount) * 100), // en centimes
          },
          quantity: participantsCount,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cancel`,
      metadata: {
        firstName,
        lastName,
        email,
        phone,
        date,
        startTime,
        participantsCount,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Erreur Stripe Checkout:", err);
    return NextResponse.json(
      { error: err.message || "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
