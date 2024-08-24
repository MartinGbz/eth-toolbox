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
import { useTheme } from "next-themes";
import { getTheme } from "./theme-toggle";

export default function ChainSelector() {
  const { theme, systemTheme, setTheme } = useTheme();
  return (
    <Select
      defaultValue={localStorage.getItem("chain-id") ?? "1"}
      onValueChange={async (value) => {
        localStorage.setItem("chain-id", value);
        const chainId = Number(value);
        await switchChain(config, { chainId: chainId });
        setTheme(getTheme(theme, systemTheme));
      }}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
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
