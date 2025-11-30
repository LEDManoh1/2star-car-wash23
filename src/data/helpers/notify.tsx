// jobs.signal.tsx
import { signal } from "@preact/signals-react";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import type { Notification } from "../../model/notification.model";

// signals for state
export const notifications = signal<Notification[]>([]);
export const notificationsLoading = signal(true);

let unsubscribeNotifications: Unsubscribe | null = null;

export async function markNotificationAsSeen(notificationId: string) {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  // Update the notification's seen status in Firestore
  const notificationRef = doc(db, "notifications", notificationId);
  await updateDoc(notificationRef, {
    seen: arrayUnion(userId),
  });
}

export async function sendNotification(params: Notification) {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  // Add the notification to Firestore
  const notificationsRef = collection(db, "notifications");
  await addDoc(notificationsRef, {
    ...params,
    createdAt: new Date(),
  });
}

// ---- Setup realtime listener ----
const initRealtimeNotifications = (firebaseUserId: string) => {
  // unsubscribe any existing listener before creating a new one
  unsubscribeNotifications?.();
  unsubscribeNotifications = null;

  // optionally filter by userId if notifications are per-user
  const notificationsRef = query(collection(db, "notifications"));
  const notificationsQuery = query(
    notificationsRef,
    where("target", "in", [firebaseUserId, ""]),
    orderBy("createdAt", "asc")
  );

  unsubscribeNotifications = onSnapshot(
    notificationsQuery,
    (notificationsSnap) => {
      notifications.value = notificationsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
      notificationsLoading.value = false; // stop loading when snapshot resolves
    },
    (error) => {
      console.error("Error fetching notifications in realtime:", error);
      notifications.value = [];
      notificationsLoading.value = false;
    }
  );
};

// ---- Auth listener ----
export const authorizeNotificationsListener = () => {
  const unsub = onAuthStateChanged(auth, (firebaseUser) => {
    // start loading whenever auth changes
    notificationsLoading.value = true;

    if (firebaseUser) {
      initRealtimeNotifications(firebaseUser.uid);
    } else {
      // logout: clear notifications + unsubscribe
      unsubscribeNotifications?.();
      unsubscribeNotifications = null;
      notifications.value = [];
      notificationsLoading.value = false;
    }
  });

  return unsub; // so caller can stop listening to auth if needed
};
