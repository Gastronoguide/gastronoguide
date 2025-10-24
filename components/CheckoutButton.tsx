"use client";

import { loadStripe } from "@stripe/stripe-js";
import { getPricePerPerson } from "../lib/utils";
import { Button } from "./ui/button";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutButton({
  firstName,
  lastName,
  email,
  phone,
  slot,
  participantsCount,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  slot: string;
  participantsCount: number;
}) {
  const pricePerPerson = getPricePerPerson(participantsCount);
  const totalPrice = pricePerPerson * participantsCount;

  const handleCheckout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        slot,
        price: totalPrice,
        participantsCount,
      }),
    });
    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <Button
      onClick={handleCheckout}
      className="w-full"
      disabled={!firstName || !lastName || !email || !phone || !slot || participantsCount < 1}
    >
      Réserver et Payer ({totalPrice}€)
    </Button>
  );
}
