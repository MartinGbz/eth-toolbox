import { config } from "@/config";
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

const NB_SECONDS_PER_BLOCK = 12n;

export const getBlockNumberEstimation = async (timestamp: bigint) => {
  const currentBlock = await getBlock(config);
  const currentBlockNumber = currentBlock.number;
  const currentBlockTimestamp = currentBlock.timestamp;

  const blockNumberDiff =
    (timestamp - currentBlockTimestamp) / NB_SECONDS_PER_BLOCK;

  return currentBlockNumber + blockNumberDiff;
};

/**
 * Get block number by timestamp
 * The function ensure to get the last block with a timestamp after the timestamp provided OR the exact block corresponding to the timestamp
 * The function will never return a block with a timestamp inferior to the timestamp provided
 * @param timestamp the timestamp to get the block number from
 * @returns If the timestamp argument corresponds to a block it will return the block, else it will return the next block with a timestamp superior to this timestamp argument)
 */
export const getBlockNumber = async (timestamp: bigint) => {
  const lastBlock = await getBlock(config);

  const firstBlock = await getBlock(config, { blockNumber: 1n }); // Notice: We use block 1 instead of block 0 because block 0 haven't been save with timestamp on our archive node

  if (timestamp < firstBlock.timestamp) {
    throw new Error("Timestamp is before the range of available blocks");
  }

  if (timestamp > lastBlock.timestamp) {
    throw new Error("Timestamp is after the range of available blocks");
  }

  let startBlockNumber = firstBlock.number;
  let endBlockNumber = lastBlock.number;

  // dichotomous search
  while (startBlockNumber < endBlockNumber) {
    const midBlockNumber =
      startBlockNumber + (endBlockNumber - startBlockNumber) / 2n;
    const midBlock = await getBlock(config, { blockNumber: midBlockNumber });

    if (midBlock.timestamp === timestamp) {
      return midBlockNumber;
    } else if (midBlock.timestamp < timestamp) {
      startBlockNumber = midBlockNumber + 1n;
    } else {
      endBlockNumber = midBlockNumber;
    }
  }

  return startBlockNumber;
};

const daysToSeconds = (days: bigint) => {
  return days * 24n * 60n * 60n;
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

export const useBlockCalculatorSum = () => {
  const [result, setResult] = useState<Results>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const computeSum = async (numbers: NumbersDefined) => {
    setIsLoading(true);
    const result = await onComputeSum(numbers);
    setResult(result);
    setIsLoading(false);
  };
  return {
    result,
    isLoading,
    computeSum,
  };
};
