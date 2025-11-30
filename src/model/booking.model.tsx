import { Timestamp } from "firebase/firestore";

export type BookingModel = {
  id: string;
  currentStep: string;
  customerName: string;
  email: string;
  estimatedTime: string;
  location: string;
  phone: string;
  service: string;
  status: string;
  amount: number;
  time: Timestamp;
};
