"use client";

import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useBlockNumber, useWatchBlockNumber } from "wagmi";
import { Skeleton } from "./ui/skeleton";
import { Blocks } from "lucide-react";

export default function BlockCounter() {
  const [blockNumber, setBlockNumber] = useState<bigint | null>(null);
  useWatchBlockNumber({
    emitOnBegin: true,
    onBlockNumber(blockNumber) {
      setBlockNumber(blockNumber);
    },
  });
  return blockNumber ? (
    <Card className="w-fit h-fit flex items-center flex gap-x-1 p-2">
      <Blocks />
      <div>
        {`Block: `}
        <span className="font-bold"> {blockNumber.toString()}</span>
      </div>
    </Card>
  ) : (
    <Skeleton className="w-[143.21px] h-[42px]" />
  );
}
