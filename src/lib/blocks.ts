import { config } from "@/config";
import { getBlock } from "wagmi/actions";

const NB_SECONDS_PER_BLOCK = 12n;

/**
 * Estimate a block number from a timestamp
 * @param timestamp in seconds
 * @returns
 */
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

/**
 * Convert days to seconds
 * @param days
 * @returns
 */
export const daysToSeconds = (days: bigint) => {
  return days * 24n * 60n * 60n;
};

/**
 * Convert time in seconds to days, hours, minutes and seconds
 * @param time in seconds
 * @returns
 */
export const calculateTimeUnits = (time: number) => {
  const days = Math.floor(time / (24 * 3600));
  const hours = Math.floor((time % (24 * 3600)) / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  return { days, hours, minutes, seconds };
};
