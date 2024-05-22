"use client";

import { Skeleton } from "./ui/skeleton";
import { useEffect, useState } from "react";
import { Block, formatGwei } from "viem";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getGasPrice, getGasUsage } from "./blocks-widget";
import { Blocks } from "lucide-react";

interface PreviousBlocksProps {
  blocks: Block[];
  decimals: number;
  classname?: string;
}

export default function PreviousBlocks({
  blocks,
  decimals,
  classname,
}: PreviousBlocksProps) {
  return blocks ? (
    <Accordion className={classname} type="single" collapsible>
      {blocks
        .slice(0)
        .reverse()
        .map((block, index) => {
          if (!block.number) return null;
          const gasPrice = getGasPrice(block, decimals);
          return (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>
                <div className="flex items-center flex gap-x-1">
                  <Blocks />
                  {block.number.toString()}
                </div>
              </AccordionTrigger>
              {gasPrice && (
                <AccordionContent>{`⛽️ ${gasPrice}`}</AccordionContent>
              )}
              <AccordionContent>
                {block.gasUsed >= 50 ? "🔋" : "🪫"}
                {block.gasUsed + "%"}
              </AccordionContent>
              <AccordionContent>{`⏳ ${block.timestamp}`}</AccordionContent>
            </AccordionItem>
          );
        })}
    </Accordion>
  ) : (
    <Skeleton className="w-[240px] h-[186px]" />
  );
}

// "use client";

// import { Skeleton } from "./ui/skeleton";
// import { useEffect, useState } from "react";
// import { Block, formatGwei } from "viem";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { BlockProps, getGasPrice, getGasUsage } from "./blocks-widget";
// import { Blocks } from "lucide-react";
// // import { getBlock } from "wagmi/actions";
// import { config } from "@/config";
// import { useBlock } from "wagmi";

// type BlockInfo = {
//   number: bigint;
//   gasPrice: string | null;
//   gasUsed: number;
//   timestamp: bigint;
// };

// interface BlockPropsPreviousBlocks extends BlockProps {
//   classname?: string;
// }

// export default function PreviousBlocks({
//   block,
//   decimals,
//   classname,
// }: BlockPropsPreviousBlocks) {
//   const [blocks, setBlocks] = useState<BlockInfo[]>();
//   const [pendingBlock, setPendingBlock] = useState<Block>();

//   useEffect(() => {
//     if (block) {
//       setPendingBlock(block);
//     }
//   }, [block, decimals]);

//   useEffect(() => {
//     const block = pendingBlock;
//     if (!block) return;
//     const usage = getGasUsage(block, decimals);
//     setBlocks((prev) => {
//       if (block.number) {
//         if (prev) {
//           const blockAlreadyExists = prev.find(
//             (prevBlock) => prevBlock.number === block.number
//           );
//           if (blockAlreadyExists) {
//             return prev;
//           }
//           if (prev.length >= 3) {
//             prev.shift();
//           }
//           return [
//             ...prev,
//             {
//               number: block.number,
//               gasPrice: getGasPrice(block, decimals),
//               gasUsed: usage,
//               timestamp: block.timestamp,
//             },
//           ];
//         } else {
//           return [
//             {
//               number: block.number,
//               gasPrice: getGasPrice(block, decimals),
//               gasUsed: usage,
//               timestamp: block.timestamp,
//             },
//           ];
//         }
//       }
//     });
//   }, [decimals, pendingBlock]);

//   return blocks ? (
//     <Accordion className={classname} type="single" collapsible>
//       {blocks
//         .slice(0)
//         .reverse()
//         .map((block, index) => (
//           <AccordionItem key={index} value={`item-${index}`}>
//             <AccordionTrigger>
//               <div className="flex items-center flex gap-x-1">
//                 <Blocks />
//                 {block.number.toString()}
//               </div>
//             </AccordionTrigger>
//             {block.gasPrice && (
//               <AccordionContent>{`⛽️ ${block.gasPrice}`}</AccordionContent>
//             )}
//             <AccordionContent>
//               {block.gasUsed >= 50 ? "🔋" : "🪫"}
//               {block.gasUsed + "%"}
//             </AccordionContent>
//             <AccordionContent>{`⏳ ${block.timestamp}`}</AccordionContent>
//           </AccordionItem>
//         ))}
//     </Accordion>
//   ) : (
//     <Skeleton className="w-[240px] h-[186px]" />
//   );
// }
