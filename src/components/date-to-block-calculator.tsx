"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import Result from "./result";
import { InputBigint } from "./ui/input-bigint";
import { useBlockCalculatorSum } from "@/hook/use-block-calculator-sum";
import { DatePicker } from "./ui/date-picker";

export type Numbers = {
  blockNumber: bigint | undefined;
  days: bigint | undefined;
};

export default function DateToBlockCalculator() {
  // const [date, setDate] = useState<Date | undefined>();
  const { result, isLoading, dateToBlock } = useBlockCalculatorSum();

  return (
    <Card className="w-fit h-fit max-w-[500px] min-w-[300px]">
      <CardHeader>
        <CardTitle>Date to Block</CardTitle>
        <CardDescription>
          {"Estimate a block number for a Date"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        <div className="flex items-center gap-x-2">
          <DatePicker
            onChange={(date) => {
              if (date) {
                dateToBlock(date);
              }
            }}
          />
        </div>
        <div>
          {result && !isLoading && (
            <div className="flex flex-col">
              <Result
                title="Block:"
                value={result.blockNumber.toString()}
                estimation={result.estimation}
              />
            </div>
          )}
          {isLoading && (
            <div className="w-full h-[24px] flex items-center justify-center">
              <LoaderCircle size={36} className="animate-spin" />
            </div>
          )}
          {!result && !isLoading && (
            <div className="flex items-center justify-center">
              <p className="w-fit text-gray-400">results here</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}