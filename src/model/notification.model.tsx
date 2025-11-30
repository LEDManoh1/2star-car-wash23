import type { Timestamp } from "firebase/firestore";

export type NotificationModel = {
  id: string;
  subject: string;
  content: string;
  target: string;
  seen: string[];
  createdAt: Timestamp;
  intent: string;
  externalLink: boolean;
};
