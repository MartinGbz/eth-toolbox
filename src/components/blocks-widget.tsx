"use client";

import { useBlock } from "wagmi";
import { Skeleton } from "./ui/skeleton";
import { useEffect, useState } from "react";
import BlockCounter from "./block-counter";
import PreviousBlocks from "./previous-blocks";
import { Block, formatGwei } from "viem";

const decimals = 2;
const blocksDisplay = 4;

const getGasUsage = (block: Block, decimals: number) => {
  return Number(
    Number((Number(block.gasUsed) / Number(block.gasLimit)) * 100).toFixed(
      decimals
    )
  );
};

const getGasPrice = (block: Block, decimals: number) => {
  if (!block.baseFeePerGas) return null;
  return Number(formatGwei(block.baseFeePerGas)).toFixed(decimals);
};

export type BlockInfo = {
  number: bigint;
  gasPrice: string | null;
  gasUsed: number;
  timestamp: bigint;
};

export default function BlocksWidget() {
  const { data: block } = useBlock({
    watch: true,
  });

  const [blocksInfo, setBlocksInfo] = useState<BlockInfo[]>();
  const [blocks, setBlocks] = useState<Block[]>();

  useEffect(() => {
    if (block) {
      const blockInfo = {
        number: block.number,
        gasPrice: getGasPrice(block, decimals),
        gasUsed: getGasUsage(block, decimals),
        timestamp: block.timestamp,
      };

      const setBlock = <T extends Block | BlockInfo>(
        prev: T[] | undefined,
        block: T
      ) => {
        if (block.number) {
          if (prev) {
            const blockAlreadyExists = prev.find(
              (prevBlock: any) => prevBlock.number === block.number
            );
            if (blockAlreadyExists) {
              return prev;
            }
            if (prev.length >= blocksDisplay) {
              prev.shift();
            }
            return [...prev, block];
          } else {
            return [block];
          }
        }
      };

      setBlocksInfo((prev) => {
        return setBlock(prev, blockInfo);
      });
      setBlocks((prev) => {
        return setBlock(prev, block);
      });
    }
  }, [block]);

  const currentBlock = blocks ? blocks[blocks.length - 1] : null;
  const currentBlockInfo = blocksInfo
    ? blocksInfo[blocksInfo.length - 1]
    : null;

  return blocksInfo && blocksInfo.length && currentBlockInfo && currentBlock ? (
    <div className="flex flex-col">
      <BlockCounter block={currentBlock} blockInfo={currentBlockInfo} />
      <PreviousBlocks
        blocksInfos={blocksInfo.slice(0, blocksInfo.length - 1)}
        classname="px-2"
      />
    </div>
  ) : (
    <Skeleton className="w-[250px] h-[341px]" />
  );
}
