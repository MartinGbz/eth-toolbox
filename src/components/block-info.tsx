import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { config } from "@/config";
import { getBlock, GetBlockReturnType } from "wagmi/actions";
import JsonView from "@uiw/react-json-view";

const formSchema = z.object({
  blockNumber: z.string(),
});

export default function BlockInfos() {
  const [block, setBlock] = useState<GetBlockReturnType>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const block = await getBlock(config, {
      blockNumber: BigInt(values.blockNumber),
    });
    setBlock(block);
  }

  return (
    <Card className="w-fit h-fit">
      <CardHeader>
        <CardTitle>Block Info</CardTitle>
        <CardDescription>{"Get all block infos"}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="blockNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="blockNumber" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex gap-x-2 justify-center">
              <Button type="submit">{"Fetch block"}</Button>
            </div>
          </form>
        </Form>
        {block ? (
          <JsonView className="p-1" value={block} />
        ) : (
          <div className="flex items-center justify-center">
            <p className="w-fit text-gray-400">results here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
