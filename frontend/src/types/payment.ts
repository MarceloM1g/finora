import type { Client } from "./client";

export type PaymentItem = {
  id: string;
  serviceId: string;
  name: string;
  quantity: number;
  price: number;
};

export type PaymentStatus = "PENDING" | "FINALIZED" | "CANCELLED" | "OVERDUE";

export type Payment = {
  id: string;
  clientId: string;
  name: string;
  price: number;
  items: PaymentItem[];
  client: Client;
  date: string;
  time: string | null;
  description: string | null;
  status: PaymentStatus;
};
