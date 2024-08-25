"use client";

import Image from "next/image";

export const Header = () => {
  return (
    <header className="w-full flex items-center justify-center gap-x-2 p-2 font-satoshi">
      <Image
        priority
        src="/icon/eth.png"
        alt="eth"
        className="w-12"
        width={100}
        height={100}
      />
      <h1 className="text-6xl"> Eth Toolbox </h1>
    </header>
  );
};
