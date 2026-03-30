// A simple global event bus to trigger the booking modal from anywhere
export const EVENTS = {
  OPEN_BOOKING_MODAL: 'open-booking-modal',
};

export function openBookingModal() {
  window.dispatchEvent(new Event(EVENTS.OPEN_BOOKING_MODAL));
}
