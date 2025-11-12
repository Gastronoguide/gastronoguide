"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { useToast } from "../components/ui/use-toast";
import { CalendarIcon, Globe } from "lucide-react";
import { format } from "date-fns";
import { fr, enUS, es } from "date-fns/locale";
import { getPricePerPerson } from "../lib/utils";
import { calculateAvailability, getRemainingSpots, type Appointment } from "../lib/availability";
import { translations, languageNames, type Language } from "../lib/translations";

export default function Home() {
  const { toast } = useToast();
  const [language, setLanguage] = useState<Language>("fr");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reservationDate, setReservationDate] = useState<Date>();
  const [startTime, setStartTime] = useState<string | undefined>(undefined)
  const [participants, setParticipants] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [rgpdConsent, setRgpdConsent] = useState(false);

  const t = translations[language];
  const dateLocale = language === "fr" ? fr : language === "en" ? enUS : es;

  const pricePerPerson = getPricePerPerson(participants);
  const totalPrice = pricePerPerson * participants;

  // Calculate availability for selected date
  const availability = reservationDate
    ? calculateAvailability(reservationDate, appointments)
    : { morning: 12, noon: 12, total: 24 };

  // Get remaining spots for selected date and time slot
  const remainingSpots = getRemainingSpots(reservationDate, startTime, appointments);

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

  // Reset startTime and participants when date changes
  useEffect(() => {
    if (reservationDate) {
      setStartTime(undefined);
      setParticipants(1);
    }
  }, [reservationDate]);

  // Reset participants if selected count exceeds available spots for the chosen time slot
  useEffect(() => {
    if (startTime && participants > remainingSpots && remainingSpots > 0) {
      setParticipants(remainingSpots);
    }
  }, [remainingSpots, participants, startTime]);

  const handleCheckout = async () => {
    if (!reservationDate) {
      toast({
        title: t.missingDate,
        description: t.selectDateMessage,
      });
      return;
    }

    if (!startTime) {
      toast({
        title: t.missingTimeSlot,
        description: t.selectTimeSlotMessage,
      });
      return;
    }

    if (!rgpdConsent) {
      toast({
        title: t.consentRequired,
        description: t.acceptPrivacyMessage,
      });
      return;
    }

    setIsLoading(true);

    toast({
      title: t.processingTitle,
      description: t.redirectingPayment,
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
          title: t.success,
          description: t.redirectingPaymentPage,
        });

        setTimeout(() => {
          window.location.href = data.url;
        }, 500);
      } else {
        toast({
          title: t.error,
          description: t.noPaymentUrl,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
      toast({
        title: t.bookingError,
        description: t.errorOccurred,
      });
      setIsLoading(false);
    }
  };

  const isFormValid = firstName && lastName && phone && email && reservationDate && startTime && participants > 0 && rgpdConsent;

  return (
    <div className="">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Language Selector */}
        <div className="mb-4 flex justify-end">
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-2">
            <Globe className="h-4 w-4 text-gray-600" />
            <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
              <SelectTrigger className="h-9 w-[140px] border-0 shadow-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(languageNames) as Language[]).map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {languageNames[lang]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{t.reservationDetails}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">
                    {t.reservationDate}
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal h-12 ${!reservationDate && "text-muted-foreground"
                          }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {reservationDate ? (
                          format(reservationDate, "PPP", { locale: dateLocale })
                        ) : (
                          <span>{t.selectDate}</span>
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
                        appointmentData={appointments}
                        locale={dateLocale}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">
                    {t.timeSlot}
                  </Label>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t.selectTimeSlot} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="09:00 - 11:00"
                        disabled={availability.morning === 0}
                      >
                        <div className="flex items-center justify-between gap-4 w-full">
                          <span>{t.morning}</span>
                          <span className={`text-xs font-semibold ${availability.morning === 0 ? 'text-red-500' : 'text-green-600'}`}>
                            {availability.morning === 0 ? t.full : `${availability.morning} ${t.spots}`}
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="11:30 - 13:30"
                        disabled={availability.noon === 0}
                      >
                        <div className="flex items-center justify-between gap-4 w-full">
                          <span>{t.noon}</span>
                          <span className={`text-xs font-semibold ${availability.noon === 0 ? 'text-red-500' : 'text-green-600'}`}>
                            {availability.noon === 0 ? t.full : `${availability.noon} ${t.spots}`}
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">
                  {reservationDate && startTime
                    ? `${t.participants} (${remainingSpots} ${t.participantsRemaining})`
                    : `${t.participants} (${t.participantsMax})`}
                </Label>
                <Select
                  value={participants.toString()}
                  onValueChange={(value: string) => setParticipants(parseInt(value))}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1" disabled={remainingSpots < 1}>
                      <div className="flex justify-between items-center w-full gap-8">
                        <span>1 {t.person}</span>
                        <span className="font-semibold">120€</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="2" disabled={remainingSpots < 2}>
                      <div className="flex justify-between items-center w-full gap-8">
                        <span>2 {t.people}</span>
                        <span className="font-semibold">72€/pers</span>
                      </div>
                    </SelectItem>
                    {[3, 4].map((num) => (
                      <SelectItem key={num} value={num.toString()} disabled={remainingSpots < num}>
                        <div className="flex justify-between items-center w-full gap-8">
                          <span>{num} {t.people}</span>
                          <span className="font-semibold">60€/pers</span>
                        </div>
                      </SelectItem>
                    ))}
                    {[5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                      <SelectItem key={num} value={num.toString()} disabled={remainingSpots < num}>
                        <div className="flex justify-between items-center w-full gap-8">
                          <span>{num} {t.people}</span>
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
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{t.contactDetails}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div>
                  <Label htmlFor="firstName" className="text-gray-700 font-medium mb-2 block">
                    {t.firstName}
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder={t.yourFirstName}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#B6D7A5] focus:ring-2 focus:ring-[#B6D7A5]/20"
                  />
                </div>

                <div>
                  <Label htmlFor="lastName" className="text-gray-700 font-medium mb-2 block">
                    {t.lastName}
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder={t.yourLastName}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#B6D7A5] focus:ring-2 focus:ring-[#B6D7A5]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div>
                  <Label htmlFor="phone" className="text-gray-700 font-medium mb-2 block">
                    {t.phone}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t.yourPhone}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#B6D7A5] focus:ring-2 focus:ring-[#B6D7A5]/20"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium mb-2 block">
                    {t.email}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t.yourEmail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#B6D7A5] focus:ring-2 focus:ring-[#B6D7A5]/20"
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="rgpd-consent"
                    checked={rgpdConsent}
                    onCheckedChange={(checked) => setRgpdConsent(checked as boolean)}
                    className="mt-1 shrink-0"
                  />
                  <div
                    className="text-sm text-gray-700 leading-relaxed cursor-pointer max-w-prose"
                  >
                    {t.gdprConsent}{" "}
                    <a
                      href="/politique-confidentialite"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#B6D7A5] hover:text-[#B6D7A5]/80 underline font-medium"
                    >
                      {t.privacyPolicy}
                    </a>
                    {t.gdprText}
                  </div>
                </div>
              </div>


              <Button
                onClick={handleCheckout}
                disabled={!isFormValid || isLoading}
                className="w-full bg-[#B6D7A5] text-black py-4 sm:py-6 rounded-lg font-semibold text-base sm:text-lg hover:bg-[#B6D7A5]/90 transition-colors disabled:bg-[#B6D7A5]/30 disabled:cursor-not-allowed h-12 sm:h-14 disabled:text-gray-600"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin text-"></div>
                    <span className="text-sm sm:text-base">{t.processing}</span>
                  </div>
                ) : (
                  <span className="text-sm sm:text-base">{`${t.bookNow} - ${totalPrice}€`}</span>
                )}
              </Button>
            </div>
          </div>

          {/* Right Column - Summary Card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden h-fit lg:sticky lg:top-8">
            <div className="relative h-48 sm:h-56 lg:h-64">
              <img
                src="IMG_6644.JPG"
                alt={t.gastroExperience}
                className="w-full h-full object-cover object-bottom"
              />
            </div>

            <div className="p-4 sm:p-6">
              <div className="mb-4">
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">{t.gastroMorning}</h3>

                <div className="bg-[#B6D7A5]/10 border-l-4 border-[#B6D7A5] p-3 sm:p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm sm:text-base text-gray-700 font-medium">
                      {participants} {participants === 1 ? t.person : t.people}
                    </span>
                    <span className="text-sm sm:text-base text-gray-600">
                      {participants === 1 ? '120€' : `${pricePerPerson}€/pers`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#B6D7A5]/30">
                    <span className="text-base sm:text-lg font-bold text-gray-900">{t.total}</span>
                    <span className="text-2xl sm:text-3xl font-bold text-[#B6D7A5]">{totalPrice}€</span>
                  </div>
                </div>
              </div>

              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                {t.experienceDescription}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
