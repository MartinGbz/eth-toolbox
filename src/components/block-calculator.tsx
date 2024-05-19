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
import InputBlock from "./input-block";
import { getBlock } from "wagmi/actions";
import { config } from "@/config";

type TimeUnits = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const NB_SECONDS_PER_BLOCK = 12n;

const calculateTimeUnits = (time: number) => {
  const days = Math.floor(time / (24 * 3600));
  const hours = Math.floor((time % (24 * 3600)) / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  return { days, hours, minutes, seconds };
};

const computeBlockTimeDiff = async (
  blockNumber1: bigint,
  blockNumber2: bigint
) => {
  const currentBlock = await getBlock(config);
  if (
    currentBlock.number < blockNumber1 ||
    currentBlock.number < blockNumber2
  ) {
    const diffBlock = blockNumber1 - blockNumber2;
    const timeUnits = calculateTimeUnits(
      Number(diffBlock * NB_SECONDS_PER_BLOCK)
    );
    return {
      timeDiff: timeUnits,
      estimation: true,
    };
  } else {
    const block1 = await getBlock(config, {
      blockNumber: blockNumber1,
    });
    const block2 = await getBlock(config, {
      blockNumber: blockNumber2,
    });
    const timeUnits = calculateTimeUnits(
      Number(block1.timestamp - block2.timestamp)
    );
    return {
      timeDiff: timeUnits,
      estimation: false,
    };
  }
};

export default function BlockCalculator() {
  const [blockNumbers, setBlockNumbers] = useState<{
    block1: bigint | undefined;
    block2: bigint | undefined;
  }>({
    block1: undefined,
    block2: undefined,
  });
  const [result, setResult] = useState<{
    blockDiff: bigint;
    timeDiff: TimeUnits;
    estimation: boolean;
  }>();
  return (
    <Card className="w-fit h-fit">
      <CardHeader>
        <CardTitle>Block diff</CardTitle>
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
            console.log(blockNumbers);
            if (blockNumbers.block1 && blockNumbers.block2) {
              const blockNumber1 = blockNumbers.block1;
              const blockNumber2 = blockNumbers.block2;
              const { timeDiff, estimation } = await computeBlockTimeDiff(
                blockNumber1,
                blockNumber2
              );
              setResult({
                blockDiff: blockNumber1 - blockNumber2,
                timeDiff,
                estimation,
              });
              console.log(result);
            }
          }}>
          {"Calculate"}
        </Button>
        {result && (
          <div className="flex flex-col">
            <span className="flex items-center gap-x-1">
              {"Block difference:"}
              <span className="font-bold">{result.blockDiff.toString()}</span>
            </span>{" "}
            <span className="flex items-center gap-x-1">
              {"Time difference:"}
              <span className="font-bold">
                {result.timeDiff.days}d : {result.timeDiff.hours}h :{" "}
                {result.timeDiff.minutes}m : {result.timeDiff.seconds}s
              </span>
              {result.estimation && "(estimation)"}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
