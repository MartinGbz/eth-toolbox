import { QueryClient } from "@tanstack/react-query";
import { http, createConfig } from "wagmi";
import {
  arbitrum,
  base,
  Chain,
  foundry,
  mainnet,
  optimism,
  sepolia,
  zkSync,
} from "wagmi/chains";

export const chains: readonly [Chain, ...Chain[]] = [
  mainnet,
  sepolia,
  foundry,
  optimism,
  base,
  arbitrum,
  zkSync,
];

export const config = createConfig({
  chains: chains,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [foundry.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
    [zkSync.id]: http(),
  },
});

export const queryClient = new QueryClient();
