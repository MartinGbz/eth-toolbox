import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const replacerString = (key: any, value: any) =>
  typeof value === "bigint" ? value.toString() : value;

export const replacer = (key: any, value: any) =>
  typeof value === "bigint" ? { $bigint: value.toString() } : value;

export const reviver = (key: any, value: any) =>
  value !== null &&
  typeof value === "object" &&
  "$bigint" in value &&
  typeof value.$bigint === "string"
    ? BigInt(value.$bigint)
    : value;
