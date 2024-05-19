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
import InputBlock from "./input-block";
import { useBlockCalculator } from "@/hook/use-block-calculator";
import { LoaderCircle } from "lucide-react";
import Result from "./result";

type BlockNumbers = {
  block1: bigint | undefined;
  block2: bigint | undefined;
};

export default function BlockCalculator() {
  const [blockNumbers, setBlockNumbers] = useState<BlockNumbers>({
    block1: undefined,
    block2: undefined,
  });
  const { result, isLoading, computeBlockDiff } = useBlockCalculator();

  return (
    <Card className="w-fit h-fit max-w-[500px] min-w-[300px]">
      <CardHeader>
        <CardTitle>Block calculator</CardTitle>
        <CardDescription>
          {" "}
          Calculate the difference between two blocks{" "}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        <div className="flex items-center gap-x-2">
          <InputBlock blockNumber={1} setBlockNumbers={setBlockNumbers} />
          {"-"}
          <InputBlock blockNumber={2} setBlockNumbers={setBlockNumbers} />
        </div>
        <Button
          onClick={async () => {
            await computeBlockDiff(blockNumbers);
          }}>
          {"Calculate"}
        </Button>
        <div className="mt-2">
          {result && !isLoading && (
            <div className="flex flex-col">
              {result.blockTimestamp1 && result.blockTimestamp2 && (
                <div>
                  <span className="inline-block">
                    {"Block1: "}
                    <span className="font-bold">
                      {result.blockTimestamp1.toString()}
                    </span>
                    {" (" +
                      new Date(
                        Number(result.blockTimestamp1 * 1000n)
                      ).toUTCString() +
                      ")"}
                  </span>
                  <span className="inline-block">
                    {"Block2: "}
                    <span className="font-bold">
                      {result.blockTimestamp2.toString()}
                    </span>
                    {" (" +
                      new Date(
                        Number(result.blockTimestamp2 * 1000n)
                      ).toUTCString() +
                      ")"}
                  </span>
                </div>
              )}
              {result.blockTimestamp1 && result.blockTimestamp2 && (
                <hr className="my-2" />
              )}
              <Result
                title="Block difference:"
                value={result.blockDiff.toString()}
              />
              <Result
                title="Time difference:"
                value={`${result.timeDiff.days}d : ${result.timeDiff.hours}h : ${result.timeDiff.minutes}m : ${result.timeDiff.seconds}s`}
              />
            </div>
          )}
          {isLoading && (
            <div className="w-full h-[113px] flex items-center justify-center">
              <LoaderCircle size={36} className="animate-spin" />
            </div>
          )}
          {!result && !isLoading && (
            <div className="h-[113px] flex items-center justify-center">
              <p className="w-fit text-gray-400">results here</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
