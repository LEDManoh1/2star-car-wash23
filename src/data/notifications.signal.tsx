import { auth, db } from "@/firebase";
import { signal } from "@preact/signals-react";
import { onAuthStateChanged } from "firebase/auth";
import { dataListener } from "./read";
import { NotificationModel } from "@/model/notification.model";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

export const notifications = signal<NotificationModel[]>([]);
export const notificationsLoading = signal<boolean>(false);

export async function markNotificationAsSeen(notificationId: string) {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  // Update the notification's seen status in Firestore
  const notificationRef = doc(db, "notifications", notificationId);
  await updateDoc(notificationRef, {
    seen: arrayUnion(userId),
  });
}

export const initNotificationsListener = () => {
  const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
    notificationsLoading.value = true;

    if (firebaseUser) {
      //listen for user info
      dataListener("notifications", null, "notifications", [], (res) => {
        if (res !== null || res !== undefined) {
          if (Array.isArray(res)) {
            notifications.value = res as NotificationModel[];
            console.log(res);
          }
        }
        notificationsLoading.value = false;
      });
    } else {
      notifications.value = [];
      notificationsLoading.value = false;
    }
  });
  return unsub;
};
