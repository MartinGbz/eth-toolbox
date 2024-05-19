"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlock } from "wagmi";
import { Skeleton } from "./ui/skeleton";
import { Blocks } from "lucide-react";
import { useEffect, useState } from "react";
import { formatGwei } from "viem";
import { Progress } from "./ui/progress";

const decimals = 2;

export default function BlockCounter() {
  const [gasUsage, setGasUsage] = useState<number>();

  const { data: block } = useBlock({
    watch: true,
  });

  useEffect(() => {
    if (block) {
      const usage = Number(
        Number((Number(block.gasUsed) / Number(block.gasLimit)) * 100).toFixed(
          decimals
        )
      );
      setGasUsage(usage);
    }
  }, [block]);

  return block?.number ? (
    <Card className="w-fit h-fit">
      <CardHeader>
        <CardTitle className="flex items-center flex gap-x-1">
          <Blocks />
          <span className="font-bold"> {block.number.toString()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        {block?.baseFeePerGas && (
          <div>
            {"⛽️ "}
            <span className="font-bold">
              {Number(formatGwei(block?.baseFeePerGas)).toFixed(decimals)}
            </span>
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
    <Skeleton className="w-[260px] h-[206px]" />
  );
}
