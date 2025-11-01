"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useToast } from "../components/ui/use-toast";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getPricePerPerson } from "../lib/utils";

export default function Home() {
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reservationDate, setReservationDate] = useState<Date>();
  const [startTime, setStartTime] = useState<string | undefined>(undefined)
  const [participants, setParticipants] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState<unknown[]>([]);

  const pricePerPerson = getPricePerPerson(participants);
  const totalPrice = pricePerPerson * participants;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/appointments");
        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        } else {
          console.error("Erreur lors de la récupération des appointments");
        }
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchAppointments();
  }, []);
  
  const handleCheckout = async () => {
    if (!reservationDate) {
      toast({
        title: "Date manquante",
        description: "Veuillez sélectionner une date de réservation",
      });
      return;
    }
    
    if (!startTime) {
      toast({
        title: "Créneau manquant",
        description: "Veuillez sélectionner un créneau horaire",
      });
      return;
    }

    setIsLoading(true);

    toast({
      title: "Traitement en cours",
      description: "Redirection vers le paiement...",
    });

    try {
      console.log("Envoi de la réservation...", {
        firstName,
        lastName,
        email,
        phone,
        startTime,
        price: totalPrice,
        participantsCount: participants,
      });

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          date: format(reservationDate, "yyyy-MM-dd", { locale: fr }),
          startTime,
          price: totalPrice,
          participantsCount: participants,
        }),
      });

      if (!res.ok) {
        const errorData = await res.text();
        console.error("Erreur de l'API:", errorData);
        throw new Error(`Erreur HTTP: ${res.status}`);
      }

      const data = await res.json();
      console.log("Réponse de l'API:", data);
      
      if (data.url) {
        toast({
          title: "Succès !",
          description: "Redirection vers la page de paiement...",
        });
        
        setTimeout(() => {
          window.location.href = data.url;
        }, 500);
      } else {
        toast({
          title: "Erreur",
          description: "Aucune URL de paiement reçue",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
      toast({
        title: "Erreur de réservation",
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
      setIsLoading(false);
    }
  };

  const isFormValid = firstName && lastName && phone && email && reservationDate && startTime && participants > 0;

  return (
    <div className="">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Détails de la Réservation</h2>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">
                    Date de réservation
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal h-12 ${
                          !reservationDate && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {reservationDate ? (
                          format(reservationDate, "PPP", { locale: fr })
                        ) : (
                          <span>Sélectionnez une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={reservationDate}
                        onSelect={setReservationDate}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                        appointmentData={appointments}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">
                    Créneau horaire
                  </Label>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Sélectionnez un créneau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00 - 11:00">
                        <div className="flex items-center gap-2">
                          <span>Matin : 09:00 - 11:00</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="11:30 - 13:30">
                        <div className="flex items-center gap-2">
                          <span>Midi : 11:30 - 13:30</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">
                  Nombre de participants (max 12)
                </Label>
                <Select 
                  value={participants.toString()} 
                  onValueChange={(value: string) => setParticipants(parseInt(value))}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">
                      <div className="flex justify-between items-center w-full gap-8">
                        <span>1 personne</span>
                        <span className="font-semibold">120€</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="2">
                      <div className="flex justify-between items-center w-full gap-8">
                        <span>2 personnes</span>
                        <span className="font-semibold">72€/pers</span>
                      </div>
                    </SelectItem>
                    {[3, 4].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        <div className="flex justify-between items-center w-full gap-8">
                          <span>{num} personnes</span>
                          <span className="font-semibold">60€/pers</span>
                        </div>
                      </SelectItem>
                    ))}
                    {[5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        <div className="flex justify-between items-center w-full gap-8">
                          <span>{num} personnes</span>
                          <span className="font-semibold">55€/pers</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Contact Details Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Coordonnées</h2>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="firstName" className="text-gray-700 font-medium mb-2 block">
                    Prénom
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Votre prénom"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#B6D7A5] focus:ring-2 focus:ring-[#B6D7A5]/20"
                  />
                </div>

                <div>
                  <Label htmlFor="lastName" className="text-gray-700 font-medium mb-2 block">
                    Nom
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Votre nom"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#B6D7A5] focus:ring-2 focus:ring-[#B6D7A5]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="phone" className="text-gray-700 font-medium mb-2 block">
                    Téléphone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Votre numéro de téléphone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#B6D7A5] focus:ring-2 focus:ring-[#B6D7A5]/20"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium mb-2 block">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Votre adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#B6D7A5] focus:ring-2 focus:ring-[#B6D7A5]/20"
                  />
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={!isFormValid || isLoading}
                className="w-full bg-[#B6D7A5] text-black py-6 rounded-lg font-semibold text-lg hover:bg-[#B6D7A5]/90 transition-colors disabled:bg-[#B6D7A5]/30 disabled:cursor-not-allowed h-14 disabled:text-gray-600"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin text-"></div>
                    <span>Traitement en cours...</span>
                  </div>
                ) : (
                  `Réserver Maintenant - ${totalPrice}€`
                )}
              </Button>
            </div>
          </div>

          {/* Right Column - Summary Card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden h-fit sticky top-8">
            <div className="relative h-64">
              <img
                src="IMG_6644.JPG"
                alt="Expérience Gastronomique"
                className="w-full h-full object-cover object-bottom"
              />
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-3xl font-bold mb-2">Matinée Gastronomique</h3>
                
                <div className="bg-[#B6D7A5]/10 border-l-4 border-[#B6D7A5] p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">
                      {participants} {participants === 1 ? 'personne' : 'personnes'}
                    </span>
                    <span className="text-gray-600">
                      {participants === 1 ? '120€' : `${pricePerPerson}€/pers`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#B6D7A5]/30">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-3xl font-bold text-[#B6D7A5]">{totalPrice}€</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Plongez dans une expérience culinaire unique où passion et saveurs se rencontrent. 
                Découvrez des plats exquis préparés avec des ingrédients locaux de qualité.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
