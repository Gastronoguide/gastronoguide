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
import { CalendarIcon, Check, Clock, Users, Calendar as CalendarDays, MapPin, Utensils } from "lucide-react";
import { format } from "date-fns";
import { fr, enUS, es } from "date-fns/locale";
import { getPricePerPerson } from "../lib/utils";
import { calculateAvailability, getRemainingSpots, type Appointment } from "../lib/availability";
import { translations } from "../lib/translations";
import { useLanguage } from "../contexts/LanguageContext";

export default function Home() {
  const { toast } = useToast();
  const { language } = useLanguage();
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="IMG_6673.JPG"
            alt="Marché Victor Hugo"
            className="w-full h-full object-cover brightness-[0.7]"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg leading-tight">
            {t.heroTitle}
          </h1>
          <p className="text-lg sm:text-2xl mb-8 drop-shadow-md font-light max-w-2xl mx-auto">
            {t.heroSubtitle}
          </p>
          <Button
            onClick={() => {
              const element = document.getElementById('reservation-section');
              if (element) {
                const offset = 80;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = element.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
              }
            }}
            size="lg"
            className="bg-[#B6D7A5] hover:bg-[#B6D7A5]/90 text-black font-bold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full transition-all transform hover:scale-105 shadow-xl"
          >
            {t.ctaBook}
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section id="about-section" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                {t.aboutTitle}
              </h2>
              <div className="w-20 h-1.5 bg-[#B6D7A5] rounded-full"></div>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t.aboutDescription}
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[300px] sm:h-[400px]">
              <img
                src="IMG_6644.png"
                alt="Product Market"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Included Section */}
      <section id="included-section" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">{t.includedTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.includedItems.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="bg-[#B6D7A5]/20 p-2 rounded-lg shrink-0">
                  <Check className="w-6 h-6 text-[#B6D7A5]" />
                </div>
                <p className="text-lg text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practical Info Section */}
      <section id="practical-section" className="py-16 sm:py-24 bg-[#B6D7A5]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">{t.practicalTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CalendarDays className="w-8 h-8 text-[#B6D7A5]" />
              </div>
              <h3 className="font-bold text-xl">Jours</h3>
              <p className="text-gray-600">{t.practicalDays}</p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Clock className="w-8 h-8 text-[#B6D7A5]" />
              </div>
              <h3 className="font-bold text-xl">Horaires</h3>
              <p className="text-gray-600">{t.practicalTimes}</p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Users className="w-8 h-8 text-[#B6D7A5]" />
              </div>
              <h3 className="font-bold text-xl">Groupe</h3>
              <p className="text-gray-600">{t.practicalGroup}</p>
            </div>
          </div>
          <div className="mt-12 p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center gap-4 max-w-2xl mx-auto">
            <div>
              <Utensils className="w-6 h-6 text-[#B6D7A5]" />
            </div>
            <p className="text-center font-medium text-gray-700 text-sm">{t.dietaryInfo}</p>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="reservation-section" className="py-16 sm:py-24">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.bookNow}</h2>
            <p className="text-gray-600">{t.selectDateMessage}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-100">
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
                  className="w-full bg-[#B6D7A5] text-black py-4 sm:py-6 rounded-lg font-semibold text-base sm:text-lg hover:bg-[#B6D7A5]/90 transition-colors disabled:bg-[#B6D7A5]/30 disabled:cursor-not-allowed h-12 sm:h-14 disabled:text-gray-600 shadow-md"
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
            <div className="bg-white rounded-lg shadow-sm overflow-hidden h-fit lg:sticky lg:top-8 border border-gray-100">
              <div className="relative h-48 sm:h-56 lg:h-64">
                <img
                  src="IMG_6644.png"
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
      </section>
    </div>
  );
}
