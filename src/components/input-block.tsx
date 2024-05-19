"use client";

import { BlockNumbers } from "@/hook/use-block-calculator";
import { Input } from "./ui/input";

interface InputBlockProps {
  blockNumber: 1 | 2;
  setBlockNumbers: React.Dispatch<React.SetStateAction<BlockNumbers>>;
}

export default function InputBlock({
  blockNumber,
  setBlockNumbers,
}: InputBlockProps) {
  return (
    <Input
      placeholder={"BlockNumber " + blockNumber}
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
        } catch (e) {
          setBlockNumbers((prev) => {
            return { ...prev, ["blockNumber" + blockNumber]: undefined };
          });
        }
        if (currentValue) {
          setBlockNumbers((prev) => {
            return { ...prev, ["blockNumber" + blockNumber]: currentValue };
          });
        } else {
          setBlockNumbers((prev) => {
            return { ...prev, ["blockNumber" + blockNumber]: undefined };
          });
        }
      }}
    />
  );
}
