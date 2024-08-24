import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { config } from "@/config";
import { switchChain } from "wagmi/actions";
import Image from "next/image";

export default function ChainSelector() {
  return (
    <Select
      onValueChange={async (value) => {
        const chainId = Number(value);
        await switchChain(config, { chainId: chainId });
      }}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Chains" />
      </SelectTrigger>
      <SelectContent>
        {config.chains.map((chain) => (
          <SelectItem key={chain.id.toString()} value={chain.id.toString()}>
            <div className="flex gap-x-2">
              <Image
                src={`/chains/${chain.id}.png`}
                alt={chain.name}
                width={20}
                height={20}
              />
              <span> {chain.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
