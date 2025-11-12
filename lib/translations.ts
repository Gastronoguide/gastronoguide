export type Language = 'fr' | 'en' | 'es';

export interface Translations {
  // Reservation Details
  reservationDetails: string;
  reservationDate: string;
  selectDate: string;
  timeSlot: string;
  selectTimeSlot: string;
  morning: string;
  noon: string;
  full: string;
  spots: string;
  participants: string;
  participantsRemaining: string;
  participantsMax: string;
  person: string;
  people: string;

  // Contact Details
  contactDetails: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  yourFirstName: string;
  yourLastName: string;
  yourPhone: string;
  yourEmail: string;

  // GDPR
  gdprConsent: string;
  privacyPolicy: string;
  gdprText: string;

  // Buttons
  bookNow: string;
  processing: string;

  // Title
  gastroExperience: string;
  gastroMorning: string;
  experienceDescription: string;
  total: string;

  // Toasts
  missingDate: string;
  selectDateMessage: string;
  missingTimeSlot: string;
  selectTimeSlotMessage: string;
  consentRequired: string;
  acceptPrivacyMessage: string;
  processingTitle: string;
  redirectingPayment: string;
  success: string;
  redirectingPaymentPage: string;
  error: string;
  noPaymentUrl: string;
  bookingError: string;
  errorOccurred: string;

  // Language
  language: string;
}

export const translations: Record<Language, Translations> = {
  fr: {
    reservationDetails: "Détails de la Réservation",
    reservationDate: "Date de réservation",
    selectDate: "Sélectionnez une date",
    timeSlot: "Créneau horaire",
    selectTimeSlot: "Sélectionnez un créneau",
    morning: "Matin : 09:00 - 11:00",
    noon: "Midi : 11:30 - 13:30",
    full: "Complet",
    spots: "places",
    participants: "Nombre de participants",
    participantsRemaining: "places restantes",
    participantsMax: "max 12",
    person: "personne",
    people: "personnes",

    contactDetails: "Coordonnées",
    firstName: "Prénom",
    lastName: "Nom",
    phone: "Téléphone",
    email: "Email",
    yourFirstName: "Votre prénom",
    yourLastName: "Votre nom",
    yourPhone: "Votre numéro de téléphone",
    yourEmail: "Votre adresse email",

    gdprConsent: "J'accepte que mes données personnelles soient collectées et traitées conformément à la",
    privacyPolicy: "politique de confidentialité",
    gdprText: ". Ces données sont nécessaires pour traiter votre réservation et vous contacter si besoin.",

    bookNow: "Réserver Maintenant",
    processing: "Traitement en cours...",

    gastroExperience: "Expérience Gastronomique",
    gastroMorning: "Matinée Gastronomique",
    experienceDescription: "Plongez dans une expérience culinaire unique où passion et saveurs se rencontrent. Découvrez des plats exquis préparés avec des ingrédients locaux de qualité.",
    total: "Total",

    missingDate: "Date manquante",
    selectDateMessage: "Veuillez sélectionner une date de réservation",
    missingTimeSlot: "Créneau manquant",
    selectTimeSlotMessage: "Veuillez sélectionner un créneau horaire",
    consentRequired: "Consentement requis",
    acceptPrivacyMessage: "Veuillez accepter la politique de confidentialité",
    processingTitle: "Traitement en cours",
    redirectingPayment: "Redirection vers le paiement...",
    success: "Succès !",
    redirectingPaymentPage: "Redirection vers la page de paiement...",
    error: "Erreur",
    noPaymentUrl: "Aucune URL de paiement reçue",
    bookingError: "Erreur de réservation",
    errorOccurred: "Une erreur est survenue. Veuillez réessayer.",

    language: "Langue",
  },
  en: {
    reservationDetails: "Reservation Details",
    reservationDate: "Reservation date",
    selectDate: "Select a date",
    timeSlot: "Time slot",
    selectTimeSlot: "Select a time slot",
    morning: "Morning: 09:00 - 11:00",
    noon: "Noon: 11:30 - 13:30",
    full: "Full",
    spots: "spots",
    participants: "Number of participants",
    participantsRemaining: "spots remaining",
    participantsMax: "max 12",
    person: "person",
    people: "people",

    contactDetails: "Contact Details",
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone",
    email: "Email",
    yourFirstName: "Your first name",
    yourLastName: "Your last name",
    yourPhone: "Your phone number",
    yourEmail: "Your email address",

    gdprConsent: "I agree that my personal data will be collected and processed in accordance with the",
    privacyPolicy: "privacy policy",
    gdprText: ". This data is necessary to process your reservation and contact you if needed.",

    bookNow: "Book Now",
    processing: "Processing...",

    gastroExperience: "Gastronomic Experience",
    gastroMorning: "Gastronomic Morning",
    experienceDescription: "Immerse yourself in a unique culinary experience where passion and flavors meet. Discover exquisite dishes prepared with quality local ingredients.",
    total: "Total",

    missingDate: "Missing date",
    selectDateMessage: "Please select a reservation date",
    missingTimeSlot: "Missing time slot",
    selectTimeSlotMessage: "Please select a time slot",
    consentRequired: "Consent required",
    acceptPrivacyMessage: "Please accept the privacy policy",
    processingTitle: "Processing",
    redirectingPayment: "Redirecting to payment...",
    success: "Success!",
    redirectingPaymentPage: "Redirecting to payment page...",
    error: "Error",
    noPaymentUrl: "No payment URL received",
    bookingError: "Booking error",
    errorOccurred: "An error occurred. Please try again.",

    language: "Language",
  },
  es: {
    reservationDetails: "Detalles de la Reserva",
    reservationDate: "Fecha de reserva",
    selectDate: "Seleccione una fecha",
    timeSlot: "Franja horaria",
    selectTimeSlot: "Seleccione una franja horaria",
    morning: "Mañana: 09:00 - 11:00",
    noon: "Mediodía: 11:30 - 13:30",
    full: "Completo",
    spots: "plazas",
    participants: "Número de participantes",
    participantsRemaining: "plazas restantes",
    participantsMax: "máx 12",
    person: "persona",
    people: "personas",

    contactDetails: "Datos de Contacto",
    firstName: "Nombre",
    lastName: "Apellido",
    phone: "Teléfono",
    email: "Email",
    yourFirstName: "Su nombre",
    yourLastName: "Su apellido",
    yourPhone: "Su número de teléfono",
    yourEmail: "Su dirección de email",

    gdprConsent: "Acepto que mis datos personales sean recopilados y procesados de acuerdo con la",
    privacyPolicy: "política de privacidad",
    gdprText: ". Estos datos son necesarios para procesar su reserva y contactarle si es necesario.",

    bookNow: "Reservar Ahora",
    processing: "Procesando...",

    gastroExperience: "Experiencia Gastronómica",
    gastroMorning: "Mañana Gastronómica",
    experienceDescription: "Sumérjase en una experiencia culinaria única donde la pasión y los sabores se encuentran. Descubra platos exquisitos preparados con ingredientes locales de calidad.",
    total: "Total",

    missingDate: "Fecha faltante",
    selectDateMessage: "Por favor seleccione una fecha de reserva",
    missingTimeSlot: "Franja horaria faltante",
    selectTimeSlotMessage: "Por favor seleccione una franja horaria",
    consentRequired: "Consentimiento requerido",
    acceptPrivacyMessage: "Por favor acepte la política de privacidad",
    processingTitle: "Procesando",
    redirectingPayment: "Redirigiendo al pago...",
    success: "¡Éxito!",
    redirectingPaymentPage: "Redirigiendo a la página de pago...",
    error: "Error",
    noPaymentUrl: "No se recibió URL de pago",
    bookingError: "Error de reserva",
    errorOccurred: "Ocurrió un error. Por favor intente de nuevo.",

    language: "Idioma",
  },
};

export const languageNames: Record<Language, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
};
