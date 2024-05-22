"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlock } from "wagmi";
import { Skeleton } from "./ui/skeleton";
import { Blocks, Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Block, formatGwei } from "viem";
import { Progress } from "./ui/progress";
import { replacerString } from "@/lib/utils";
import { BlockInfo, getGasPrice, getGasUsage } from "./blocks-widget";

export interface BlockCounterProps {
  block: Block;
  blockInfo: BlockInfo;
}

export default function BlockCounter({ block, blockInfo }: BlockCounterProps) {
  const [gasUsage, setGasUsage] = useState<number>();
  const [displayCopyCheck, setDisplayCopyCheck] = useState<boolean>(false);

  function copyBlockToClipboard(block: Block) {
    navigator.clipboard.writeText(JSON.stringify(block, replacerString));
    setDisplayCopyCheck(true);
    setTimeout(() => setDisplayCopyCheck(false), 500);
  }

  return (
    <Card className="w-[250px] h-fit">
      <CardHeader>
        <CardTitle className="flex items-center justify-between	flex gap-x-4">
          <div className="flex items-center flex gap-x-1">
            <Blocks />
            <span className="font-bold"> {blockInfo.number.toString()}</span>
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
        <div>
          {"⛽️ "}
          <span className="font-bold">{blockInfo.gasPrice}</span>
          {" Gwei"}
        </div>
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
          <span className="font-bold">{blockInfo.timestamp.toString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
