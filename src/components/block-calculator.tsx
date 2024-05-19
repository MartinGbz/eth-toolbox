"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import InputBlock from "./input-block";
import { getBlock } from "wagmi/actions";
import { config } from "@/config";

type TimeUnits = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type BlockNumbers = {
  block1: bigint | undefined;
  block2: bigint | undefined;
};

type Results = {
  blockDiff: bigint;
  timeDiff: TimeUnits;
  estimation: boolean;
  blockTimestamp1?: bigint;
  blockTimestamp2?: bigint;
};

const NB_SECONDS_PER_BLOCK = 12n;

const calculateTimeUnits = (time: number) => {
  const days = Math.floor(time / (24 * 3600));
  const hours = Math.floor((time % (24 * 3600)) / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  return { days, hours, minutes, seconds };
};

const computeTimeDiff = async (time1: bigint, time2: bigint) => {
  const timeUnits = calculateTimeUnits(Number(time1 - time2));
  return timeUnits;
};

const computeBlockTimeDiffEstimation = async (
  blockNumber1: bigint,
  blockNumber2: bigint
) => {
  const diffBlock = blockNumber1 - blockNumber2;
  const timeUnits = calculateTimeUnits(
    Number(diffBlock * NB_SECONDS_PER_BLOCK)
  );
  return timeUnits;
};

const onComputeBlockDiff = async (
  blockNumbers: BlockNumbers,
  setResult: Dispatch<SetStateAction<Results | undefined>>
) => {
  if (blockNumbers.block1 && blockNumbers.block2) {
    const currentBlock = await getBlock(config);
    const blockNumber1 = blockNumbers.block1;
    const blockNumber2 = blockNumbers.block2;
    let block1;
    let block2;
    let timeDiff;
    let estimation = true;
    if (
      currentBlock.number >= blockNumber1 &&
      currentBlock.number >= blockNumber2
    ) {
      estimation = false;
      block1 = await getBlock(config, {
        blockNumber: blockNumber1,
      });
      block2 = await getBlock(config, {
        blockNumber: blockNumber2,
      });
      timeDiff = await computeTimeDiff(block1.timestamp, block2.timestamp);
    } else {
      estimation = true;
      timeDiff = await computeBlockTimeDiffEstimation(
        blockNumber1,
        blockNumber2
      );
    }
    if (block1?.timestamp) {
      console.log(block1?.timestamp);
      console.log(Number(block1?.timestamp * 1000n));
      console.log(new Date(Number(block1?.timestamp * 1000n)));
    }
    setResult({
      blockDiff: blockNumber1 - blockNumber2,
      timeDiff,
      estimation,
      blockTimestamp1: block1?.timestamp,
      blockTimestamp2: block2?.timestamp,
    });
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
  const [result, setResult] = useState<Results>();
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
            await onComputeBlockDiff(blockNumbers, setResult);
          }}>
          {"Calculate"}
        </Button>
        {result && (
          <div className="flex flex-col">
            {result.blockTimestamp1 && result.blockTimestamp2 && (
              <div>
                <span className="flex items-center gap-x-1">
                  {"Block 1: "}
                  <span className="font-bold">
                    {result.blockTimestamp1.toString()}
                  </span>
                  {"(" +
                    new Date(
                      Number(result.blockTimestamp1 * 1000n)
                    ).toUTCString() +
                    ")"}
                </span>
                <span className="flex items-center gap-x-1">
                  {"Block 2: "}
                  <span className="font-bold">
                    {result.blockTimestamp2.toString()}
                  </span>
                  {"(" +
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
            <span className="flex items-center gap-x-1">
              {"Block difference:"}
              <span className="font-bold">{result.blockDiff.toString()}</span>
            </span>
            <span className="flex items-center gap-x-1">
              {"Block difference:"}
              <span className="font-bold">{result.blockDiff.toString()}</span>
            </span>
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
