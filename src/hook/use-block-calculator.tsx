import { config } from "@/config";
import {
  daysToSeconds,
  getBlockNumber,
  getBlockNumberEstimation,
} from "@/lib/blocks";
import { useState } from "react";
import { getBlock } from "wagmi/actions";

export type NumbersDefined = {
  blockNumber: bigint;
  days: bigint;
};

type Results = {
  blockNumber: bigint;
  estimation: boolean;
};

const onComputeSum = async (numbers: NumbersDefined): Promise<Results> => {
  const currentBlock = await getBlock(config);
  const blockNumber = numbers.blockNumber;
  const block = await getBlock(config, {
    blockNumber: blockNumber,
  });
  const targetTime = block.timestamp + daysToSeconds(numbers.days);
  if (currentBlock.timestamp >= targetTime) {
    // get the block at the target time
    const block = await getBlockNumber(targetTime);
    return {
      blockNumber: block,
      estimation: false,
    };
  } else {
    // estimate the block at the target time
    const block = await getBlockNumberEstimation(targetTime);
    return {
      blockNumber: block,
      estimation: true,
    };
  }
};

function getOnlyDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  console.log(year, month, day);
  const utcDate = new Date(Date.UTC(year, month, day));
  return utcDate;
}

const onDateToBlock = async (date: Date): Promise<Results> => {
  const dateTimestamp = BigInt(getOnlyDate(date).getTime() / 1000);
  const currentBlock = await getBlock(config);
  if (currentBlock.timestamp >= dateTimestamp) {
    // get the block at the target time
    const block = await getBlockNumber(dateTimestamp);
    return {
      blockNumber: block,
      estimation: false,
    };
  } else {
    // estimate the block at the target time
    const block = await getBlockNumberEstimation(dateTimestamp);
    return {
      blockNumber: block,
      estimation: true,
    };
  }
};

export const useBlockCalculator = () => {
  const [result, setResult] = useState<Results>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const computeSum = async (numbers: NumbersDefined) => {
    setIsLoading(true);
    const result = await onComputeSum(numbers);
    setResult(result);
    setIsLoading(false);
  };

  const dateToBlock = async (date: Date) => {
    setIsLoading(true);
    const result = await onDateToBlock(date);
    setResult(result);
    setIsLoading(false);
  };

  return {
    result,
    isLoading,
    computeSum,
    dateToBlock,
  };
};
