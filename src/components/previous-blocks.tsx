"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BlockInfo } from "./blocks-widget";
import { Box } from "lucide-react";

interface PreviousBlocksProps {
  blocksInfos: BlockInfo[];
  classname?: string;
}

export default function PreviousBlocks({
  blocksInfos,
  classname,
}: PreviousBlocksProps) {
  return (
    <Accordion className={classname} type="single" collapsible>
      {blocksInfos
        .slice(0)
        .reverse()
        .map((block, index) => {
          return (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>
                <div className="flex items-center flex gap-x-1">
                  <Box />
                  {block.number.toString()}
                </div>
              </AccordionTrigger>
              <AccordionContent>{`⛽️ ${block.gasPrice}`}</AccordionContent>
              <AccordionContent>
                {block.gasUsed >= 50 ? "🔋" : "🪫"}
                {block.gasUsed + "%"}
              </AccordionContent>
              <AccordionContent>{`⏳ ${block.timestamp}`}</AccordionContent>
            </AccordionItem>
          );
        })}
    </Accordion>
  );
}
