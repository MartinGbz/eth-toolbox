"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getChainId } from "wagmi/actions";
import { config } from "@/config";
import { useHydrated } from "@/hook/use-hydrated";

export const getTheme = (
  theme: string | undefined,
  systemTheme: "light" | "dark" | undefined
) => {
  const defaultTheme = "light";

  let themeMode = theme ? theme.split("-")[0] : defaultTheme;
  if (themeMode === "system") {
    themeMode = systemTheme || defaultTheme;
  }

  const chainId = getChainId(config);

  return `${themeMode}-${chainId}`;
};

const getThemeMode = (theme: string | undefined) => {
  return theme ? theme.split("-")[0] : undefined;
};

export function ThemeToggle() {
  const { theme, systemTheme, setTheme } = useTheme();

  const hydrated = useHydrated();

  return (
    hydrated && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            {getThemeMode(theme) === "light" ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className=" h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setTheme(getTheme("light", systemTheme))}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme(getTheme("dark", systemTheme))}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme(getTheme("system", systemTheme))}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
}
