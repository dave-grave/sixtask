import React, { Suspense } from "react";
import CallbackHandler from "./CallbackHandler";

export default function Callback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackHandler />
    </Suspense>
  );
}
