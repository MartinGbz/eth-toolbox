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
import Result from "./result";

const formSchema = z.object({
  string: z.string(),
});

export default function CaseFormatter() {
  const [stringFormatted, setStringFormatted] = useState<string>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      string: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>, lowerCase: boolean) {
    let formattedString = "";
    if (lowerCase) {
      formattedString = values.string.toLowerCase();
    } else {
      formattedString = values.string.toUpperCase();
    }
    navigator.clipboard.writeText(formattedString);
    setStringFormatted(formattedString);
  }

  return (
    <Card className="w-fit h-fit">
      <CardHeader>
        <CardTitle>{"String formatter"}</CardTitle>
        <CardDescription> {"Lower or Upper a string"}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        <Form {...form}>
          <form className="space-y-2">
            <FormField
              control={form.control}
              name="string"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Any string" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex gap-x-2 justify-center">
              <Button
                onClick={form.handleSubmit((data) => onSubmit(data, true))}>
                {"toLower & Copy"}
              </Button>
              <Button
                onClick={form.handleSubmit((data) => onSubmit(data, false))}>
                {"toUpper & Copy"}
              </Button>
            </div>
          </form>
        </Form>
        {stringFormatted ? (
          <Result title="Result:" value={stringFormatted} />
        ) : (
          <div className="flex items-center justify-center">
            <p className="w-fit text-gray-400">results here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
