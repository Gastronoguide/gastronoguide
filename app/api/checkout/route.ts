import { NextResponse } from "next/server";
import Stripe from "stripe";
import { MIN_HOURS_BEFORE_BOOKING } from "@/lib/availability";

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-10-29.clover",
  });
};

function isTimeSlotBookableServer(dateStr: string, startTime: string): boolean {
  const now = new Date();

  // Parse the date (format: "yyyy-MM-dd")
  const [year, month, day] = dateStr.split('-').map(Number);

  // Get the start hour of the time slot
  const slotStartHour = startTime.includes("09:00") ? 9 : 11.5;

  // Create a date object for the slot start time
  const slotDateTime = new Date(year, month - 1, day, Math.floor(slotStartHour), (slotStartHour % 1) * 60, 0, 0);

  // Calculate the difference in milliseconds
  const diffMs = slotDateTime.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours >= MIN_HOURS_BEFORE_BOOKING;
}

export async function POST(req: Request) {
  try {
    const stripe = getStripe();
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

    // Validate no bookings on Mondays
    const [year, month, day] = date.split('-').map(Number);
    const bookingDate = new Date(year, month - 1, day);
    if (bookingDate.getDay() === 1) {
      return NextResponse.json(
        { error: "Les réservations ne sont pas disponibles le lundi" },
        { status: 400 }
      );
    }

    // Validate minimum booking time (2 hours in advance)
    if (!isTimeSlotBookableServer(date, startTime)) {
      return NextResponse.json(
        { error: "Les réservations doivent être effectuées au moins 2 heures à l'avance" },
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
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Erreur Stripe Checkout:", error);
    return NextResponse.json(
      { error: error.message || "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
