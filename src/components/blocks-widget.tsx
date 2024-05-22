"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlock } from "wagmi";
import { Skeleton } from "./ui/skeleton";
import { Blocks, Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import BlockCounter from "./block-counter";
import PreviousBlocks from "./previous-blocks";
import { Block, formatGwei } from "viem";

const decimals = 2;

export const getGasUsage = (block: Block, decimals: number) => {
  return Number(
    Number((Number(block.gasUsed) / Number(block.gasLimit)) * 100).toFixed(
      decimals
    )
  );
};

export const getGasPrice = (block: Block, decimals: number) => {
  if (!block.baseFeePerGas) return null;
  return Number(formatGwei(block.baseFeePerGas)).toFixed(decimals);
};

// type BlockInfo = {
//   number: bigint;
//   gasPrice: string | null;
//   gasUsed: number;
//   timestamp: bigint;
// };

const blocksDisplay = 4;

export default function BlocksWidget() {
  const { data: block } = useBlock({
    watch: true,
  });

  const [blocks, setBlocks] = useState<Block[]>();

  useEffect(() => {
    if (block) {
      setBlocks((prev) => {
        if (block.number) {
          if (prev) {
            const blockAlreadyExists = prev.find(
              (prevBlock) => prevBlock.number === block.number
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
      });
    }
  }, [block]);

  return blocks && blocks.length ? (
    <div className="flex flex-col">
      <BlockCounter block={blocks[blocks.length - 1]} decimals={decimals} />
      <PreviousBlocks
        blocks={blocks.slice(0, blocks.length - 1)}
        decimals={decimals}
        classname="px-2"
      />
    </div>
  ) : (
    <Skeleton className="w-[250px] h-[341px]" />
  );
}
