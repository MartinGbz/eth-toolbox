"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WagmiProvider } from "wagmi";
import { config, queryClient } from "@/config";
import { QueryClientProvider } from "@tanstack/react-query";
import BlockCalculator from "@/components/block-calculator";
import AddressFormatter from "@/components/address-formatter";
import CaseFormatter from "@/components/case-formatter";
import BlocksWidget from "@/components/blocks-widget";
import BlockCalculatorSum from "@/components/block-calculator-sum";
import DateToBlockCalculator from "@/components/date-to-block-calculator";
import BlockInfos from "@/components/block-info";
import ChainSelector from "@/components/chain-selector";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="w-full h-full min-w-[800px] p-4">
          <Card className="w-full h-full">
            <CardHeader className="flex flex-row justify-between">
              <div>
                <CardTitle>Eth toolbox</CardTitle>
                <CardDescription>
                  Your ethereum developer toolbox
                </CardDescription>
              </div>
              <div className="flex gap-x-2">
                <ChainSelector />
                <ThemeToggle />
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <BlocksWidget />
              <BlockCalculator />
              <BlockCalculatorSum />
              <DateToBlockCalculator />
              <AddressFormatter />
              <CaseFormatter />
              <BlockInfos />
            </CardContent>
            <CardFooter>
              <p className="m-auto">
                {"Made with 💜 by "}
                <a
                  className="font-semibold underline decoration-solid underline-offset-2"
                  href="https://x.com/0xMartinGbz">
                  MartinGbz
                </a>
              </p>
            </CardFooter>
          </Card>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
