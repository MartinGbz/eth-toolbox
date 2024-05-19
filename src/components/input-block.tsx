"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";

interface InputBlockProps {
  blockNumber: 1 | 2;
  setBlockNumbers: React.Dispatch<
    React.SetStateAction<{
      block1: bigint | undefined;
      block2: bigint | undefined;
    }>
  >;
}

export default function InputBlock({
  blockNumber,
  setBlockNumbers,
}: InputBlockProps) {
  return (
    <Input
      onKeyDown={(e) => {
        if (/^[eE.\+\-]$/.test(e.key)) e.preventDefault(); // Prevents typing e, E, +, -, .
      }}
      onPaste={(e) => {
        if (!/^\d+$/.test(e.clipboardData.getData("text/plain")))
          e.preventDefault(); // Prevents pasting non-numeric values
      }}
      type="number"
      onChange={(e) => {
        let currentValue;
        try {
          currentValue = BigInt(e.target.value);
          console.log(currentValue);
        } catch (e) {
          console.log(e);
        }
        if (currentValue) {
          console.log(currentValue);
          setBlockNumbers((prev) => {
            return { ...prev, ["block" + blockNumber]: currentValue };
          });
        }
      }}
    />
  );
}
