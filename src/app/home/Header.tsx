import React from "react";
import { GenerateText } from "@/components/ui/GenerateText";

export default function Header() {
  return (
    <div>
      <p className="dark:text-white text-black text-5xl m-12 font-bold">
        sixtask
      </p>
      {/* <GenerateText words="sixtask" duration={1.5} /> */}
    </div>
  );
}
