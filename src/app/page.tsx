"use client";

import BlockCounter from "@/components/block-counter";
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

export default function Home() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="w-full h-full p-4">
          <Card className="w-full h-full">
            <CardHeader>
              <CardTitle>eth toolbox</CardTitle>
              <CardDescription>Your developer ethereum toolbox</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <BlockCounter />
              <BlockCalculator />
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
