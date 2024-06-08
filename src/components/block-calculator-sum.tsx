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
import { useBlockCalculator } from "@/hook/use-block-calculator";

export type Numbers = {
  blockNumber: bigint | undefined;
  days: bigint | undefined;
};

export default function BlockCalculatorSum() {
  const [numbers, setNumbers] = useState<Numbers>({
    blockNumber: undefined,
    days: undefined,
  });
  const { result, isLoading, computeSum } = useBlockCalculator();

  return (
    <Card className="w-fit h-fit max-w-[500px] min-w-[300px]">
      <CardHeader>
        <CardTitle>Block calculator sum</CardTitle>
        <CardDescription>
          {"Calculate the sum of a block number and a number of days"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        <div className="flex items-center gap-x-2">
          <InputBigint
            placeholder="BlockNumber"
            onChange={(e) => {
              setNumbers((prev) => {
                return { ...prev, blockNumber: BigInt(e.target.value) };
              });
            }}
          />
          {"+"}
          <InputBigint
            placeholder="Days"
            onChange={(e) => {
              setNumbers((prev) => {
                return { ...prev, days: BigInt(e.target.value) };
              });
            }}
          />
        </div>
        <Button
          onClick={async () => {
            console.log(numbers);
            if (numbers.blockNumber && numbers.days) {
              await computeSum({
                blockNumber: numbers.blockNumber,
                days: numbers.days,
              });
            }
          }}>
          {"Calculate"}
        </Button>
        <div className="mt-2">
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
