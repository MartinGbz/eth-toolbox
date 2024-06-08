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
import { Address, checksumAddress, isAddress } from "viem";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Result from "./result";

const formSchema = z.object({
  address: z.string().refine((value) => isAddress(value), {
    message: "Should be a valid address",
  }),
});

export default function AddressFormatter() {
  const [addressChecksumed, setAddressChecksumed] = useState<Address>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const checksumedAddress = checksumAddress(values.address as Address);
    navigator.clipboard.writeText(checksumedAddress);
    setAddressChecksumed(checksumedAddress);
  }

  return (
    <Card className="w-fit h-fit">
      <CardHeader>
        <CardTitle>Address formatter</CardTitle>
        <CardDescription>{"Format an address to checksum"}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="0x123..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex gap-x-2 justify-center">
              <Button className="" type="submit">
                {"Format & Copy"}
              </Button>
            </div>
          </form>
        </Form>
        {addressChecksumed ? (
          <Result title="Address:" value={addressChecksumed} />
        ) : (
          <div className="flex items-center justify-center">
            <p className="w-fit text-gray-400">results here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
