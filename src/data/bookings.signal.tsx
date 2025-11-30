import { auth } from "@/firebase";
import { signal } from "@preact/signals-react";
import { onAuthStateChanged } from "firebase/auth";
import { dataListener } from "./read";
import { BookingModel } from "@/model/booking.model";

export const bookings = signal<BookingModel[]>([]);
export const bookingsLoading = signal<boolean>(false);
export const priceSettingId = signal<string>("");

export const initBookingsListener = () => {
  const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
    bookingsLoading.value = true;

    if (firebaseUser) {
      //listen for user info
      dataListener("bookings", null, "bookings", [], (res) => {
        if (res !== null || res !== undefined) {
          if (Array.isArray(res)) {
            bookings.value = res as BookingModel[];
          }
        }
        bookingsLoading.value = false;
      });
    } else {
      bookings.value = [];
      bookingsLoading.value = false;
    }
  });
  return unsub;
};
