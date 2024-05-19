import { config } from "@/config";
import { Dispatch, SetStateAction, useState } from "react";
import { getBlock } from "wagmi/actions";

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

const onComputeBlockDiff = async (blockNumbers: BlockNumbers) => {
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
    return {
      blockDiff: blockNumber1 - blockNumber2,
      timeDiff,
      estimation,
      blockTimestamp1: block1?.timestamp,
      blockTimestamp2: block2?.timestamp,
    };
  }
};

export const useBlockCalculator = () => {
  const [result, setResult] = useState<Results>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const computeBlockDiff = async (blockNumbers: BlockNumbers) => {
    setIsLoading(true);
    const result = await onComputeBlockDiff(blockNumbers);
    setResult(result);
    setIsLoading(false);
  };
  return {
    result,
    isLoading,
    computeBlockDiff,
  };
};
