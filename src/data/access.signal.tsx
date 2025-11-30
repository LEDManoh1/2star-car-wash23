import { auth } from "@/firebase";
import { UserModel } from "@/model/user.model";
import { signal } from "@preact/signals-react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { dataListener } from "./read";
import { initBookingsListener } from "./bookings.signal";
import { initNotificationsListener } from "./notifications.signal";

export const user = signal<User | null>(null);
export const userInfo = signal<UserModel | null>(null);
export const authLoading = signal<boolean>(false);

export const initAuthListener = () => {
  const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
    authLoading.value = true;

    if (firebaseUser) {
      user.value = firebaseUser;
      //listen for user info
      dataListener("users", firebaseUser.uid, "admin", [], (res) => {
        if (res !== null || res !== undefined) {
          if (!Array.isArray(res)) {
            userInfo.value = res as UserModel;
          }
        }
      });
      authLoading.value = false;
      //listen booking
      initBookingsListener();
      initNotificationsListener();
    } else {
      user.value = null;
      authLoading.value = false;
    }
  });
  return unsub;
};

export const logout = async () => {
  await signOut(auth);
  user.value = null;
};
