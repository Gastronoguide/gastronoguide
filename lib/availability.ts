export type TimeSlot = "09:00 - 11:00" | "11:30 - 13:30";

export const MAX_SPOTS_PER_SLOT = 12;
export const TOTAL_SPOTS_PER_DAY = 24;

export interface Appointment {
  startTime: Date | string;
  participantCount: number;
}

export interface SlotAvailability {
  morning: number; // remaining spots
  noon: number; // remaining spots
  total: number; // total remaining spots for the day
}

/**
 * Extract time slot from a startTime string (e.g., "09:00 - 11:00")
 */
export function getTimeSlotFromStartTime(startTime: Date | string): TimeSlot | null {
  const timeStr = typeof startTime === 'string' ? startTime : startTime.toISOString();

  // Check if it contains the time slot format
  if (timeStr.includes("09:00")) {
    return "09:00 - 11:00";
  } else if (timeStr.includes("11:30")) {
    return "11:30 - 13:30";
  }

  // Fallback: extract hour from ISO string
  const hour = new Date(timeStr).getHours();
  if (hour >= 9 && hour < 11) {
    return "09:00 - 11:00";
  } else if (hour >= 11 && hour < 14) {
    return "11:30 - 13:30";
  }

  return null;
}

/**
 * Normalize date to local date string (YYYY-MM-DD) without timezone issues
 */
function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Convert UTC date string to local date string for comparison
 */
function utcToLocalDateString(dateStr: string): string {
  const utcDate = new Date(dateStr);
  return getLocalDateString(utcDate);
}

/**
 * Calculate remaining spots for a specific date
 */
export function calculateAvailability(
  date: Date,
  appointments: Appointment[]
): SlotAvailability {
  const dateStr = getLocalDateString(date);

  let morningBooked = 0;
  let noonBooked = 0;

  for (const appointment of appointments) {
    const appointmentDateStr = utcToLocalDateString(
      typeof appointment.startTime === 'string'
        ? appointment.startTime
        : appointment.startTime.toISOString()
    );

    // Check if appointment is on the same date
    if (appointmentDateStr === dateStr) {
      const slot = getTimeSlotFromStartTime(appointment.startTime);

      if (slot === "09:00 - 11:00") {
        morningBooked += appointment.participantCount;
      } else if (slot === "11:30 - 13:30") {
        noonBooked += appointment.participantCount;
      }
    }
  }

  const morningRemaining = Math.max(0, MAX_SPOTS_PER_SLOT - morningBooked);
  const noonRemaining = Math.max(0, MAX_SPOTS_PER_SLOT - noonBooked);

  return {
    morning: morningRemaining,
    noon: noonRemaining,
    total: morningRemaining + noonRemaining,
  };
}

/**
 * Get remaining spots for a specific date and time slot
 */
export function getRemainingSpots(
  date: Date | undefined,
  timeSlot: string | undefined,
  appointments: Appointment[]
): number {
  if (!date || !timeSlot) {
    return MAX_SPOTS_PER_SLOT;
  }

  const availability = calculateAvailability(date, appointments);

  if (timeSlot === "09:00 - 11:00") {
    return availability.morning;
  } else if (timeSlot === "11:30 - 13:30") {
    return availability.noon;
  }

  return MAX_SPOTS_PER_SLOT;
}

/**
 * Minimum hours required before a booking can be made
 */
export const MIN_HOURS_BEFORE_BOOKING = 2;

/**
 * Check if a time slot is bookable (at least MIN_HOURS_BEFORE_BOOKING hours in advance)
 */
export function isTimeSlotBookable(
  date: Date | undefined,
  timeSlot: TimeSlot
): boolean {
  if (!date) {
    return true;
  }

  const now = new Date();

  // Get the start hour of the time slot
  const slotStartHour = timeSlot === "09:00 - 11:00" ? 9 : 11.5;

  // Create a date object for the slot start time
  const slotDateTime = new Date(date);
  slotDateTime.setHours(Math.floor(slotStartHour), (slotStartHour % 1) * 60, 0, 0);

  // Calculate the difference in milliseconds
  const diffMs = slotDateTime.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours >= MIN_HOURS_BEFORE_BOOKING;
}

/**
 * Calculate availability for multiple dates (for calendar view)
 */
export function calculateAvailabilityMap(
  appointments: Appointment[]
): Map<string, SlotAvailability> {
  const availabilityMap = new Map<string, SlotAvailability>();

  // Group appointments by local date
  const dateGroups = new Map<string, Appointment[]>();

  for (const appointment of appointments) {
    const dateStr = utcToLocalDateString(
      typeof appointment.startTime === 'string'
        ? appointment.startTime
        : appointment.startTime.toISOString()
    );

    if (!dateGroups.has(dateStr)) {
      dateGroups.set(dateStr, []);
    }
    dateGroups.get(dateStr)!.push(appointment);
  }

  // Calculate availability for each date
  for (const [dateStr, dateAppointments] of dateGroups) {
    // Parse the local date string
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    availabilityMap.set(dateStr, calculateAvailability(date, dateAppointments));
  }

  return availabilityMap;
}
