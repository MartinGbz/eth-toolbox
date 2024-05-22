"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlock } from "wagmi";
import { Skeleton } from "./ui/skeleton";
import { Blocks, Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Block, formatGwei } from "viem";
import { Progress } from "./ui/progress";
import { replacerString } from "@/lib/utils";
import { getGasPrice, getGasUsage } from "./blocks-widget";

export interface BlockCounterProps {
  block: Block;
  decimals: number;
}

export default function BlockCounter({ block, decimals }: BlockCounterProps) {
  const [gasUsage, setGasUsage] = useState<number>();
  const [displayCopyCheck, setDisplayCopyCheck] = useState<boolean>(false);

  useEffect(() => {
    if (block) {
      const usage = getGasUsage(block, decimals);
      setGasUsage(usage);
    }
  }, [block, decimals]);

  function copyBlockToClipboard(block: Block) {
    navigator.clipboard.writeText(JSON.stringify(block, replacerString));
    setDisplayCopyCheck(true);
    setTimeout(() => setDisplayCopyCheck(false), 500);
  }

  return block?.number ? (
    <Card className="w-[250px] h-fit">
      <CardHeader>
        <CardTitle className="flex items-center justify-between	flex gap-x-4">
          <div className="flex items-center flex gap-x-1">
            <Blocks />
            <span className="font-bold"> {block.number.toString()}</span>
          </div>
          {!displayCopyCheck && (
            <Copy
              className="cursor-pointer"
              onClick={() => copyBlockToClipboard(block)}
            />
          )}
          {displayCopyCheck && <Check />}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        {block?.baseFeePerGas && (
          <div>
            {"⛽️ "}
            <span className="font-bold">{getGasPrice(block, decimals)}</span>
            {" Gwei"}
          </div>
        )}
        {gasUsage && (
          <div className="flex items-center gap-x-2">
            <div className="flex items-center gap-x-1">
              {gasUsage >= 50 ? "🔋" : "🪫"}
              <span className="font-bold">{gasUsage}</span>
              {"%"}
            </div>
            <Progress value={gasUsage} />
          </div>
        )}
        <div>
          {"⏳ "}
          <span className="font-bold">{block.timestamp.toString()}</span>
        </div>
      </CardContent>
    </Card>
  ) : (
    <Skeleton className="w-[240px] h-[186px]" />
  );
}
