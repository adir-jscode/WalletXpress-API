import z from "zod";
import { WalletStatus } from "./wallet.interface";

export const addMoneySchema = z.object({
  phone: z.string(),
  balance: z.number().positive(),
});
export const withdrawMoneySchema = z.object({
  phone: z.string(),
  balance: z.number().positive(),
});

export const updateWalletStatusZodSchema = z.object({
  status: z.enum(Object.values(WalletStatus) as [string]),
});
