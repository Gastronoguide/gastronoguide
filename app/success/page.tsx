"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Calendar, Clock, Users, Mail, Phone, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface BookingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  startTime: string;
  participantsCount: number;
  totalAmount: number;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/session?session_id=${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          setBookingDetails(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des détails:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#B6D7A5] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full mb-4 sm:mb-6">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Réservation Confirmée !
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Merci pour votre réservation. Un email de confirmation vous a été envoyé.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">

          {bookingDetails ? (
            <div className="p-6 sm:p-8">
              {/* Date and Time Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#B6D7A5]/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-[#B6D7A5]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {format(new Date(bookingDetails.date), "EEEE d MMMM yyyy", { locale: fr })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#B6D7A5]/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-[#B6D7A5]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Créneau horaire</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {bookingDetails.startTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Participants Section */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#B6D7A5]/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#B6D7A5]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Nombre de participants</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {bookingDetails.participantsCount} {bookingDetails.participantsCount > 1 ? "personnes" : "personne"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Coordonnées</h3>

                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nom complet</p>
                    <p className="text-base font-medium text-gray-900">
                      {bookingDetails.firstName} {bookingDetails.lastName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-base font-medium text-gray-900">{bookingDetails.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="text-base font-medium text-gray-900">{bookingDetails.phone}</p>
                  </div>
                </div>
              </div>

              {/* Total Amount */}
              <div className="bg-[#B6D7A5]/10 border-l-4 border-[#B6D7A5] p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Montant total payé</p>
                    <p className="text-3xl font-bold text-[#B6D7A5]">
                      {bookingDetails.totalAmount.toFixed(2)}€
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Prix par personne</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {(bookingDetails.totalAmount / bookingDetails.participantsCount).toFixed(2)}€
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-8 text-center">
              <p className="text-gray-600">
                Votre réservation a été confirmée avec succès !
              </p>
            </div>
          )}
        </div>
        <div className="text-center">
          <a
            href="/"
            className="inline-block bg-[#B6D7A5] text-black px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#B6D7A5]/90 transition-colors"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}
