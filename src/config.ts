import { QueryClient } from "@tanstack/react-query";
import { http, createConfig } from "wagmi";
import { base, Chain, mainnet, optimism, sepolia } from "wagmi/chains";

export const chains: readonly [Chain, ...Chain[]] = [
  mainnet,
  sepolia,
  optimism,
  base,
];

export const config = createConfig({
  chains: chains,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
  },
});

export const queryClient = new QueryClient();
