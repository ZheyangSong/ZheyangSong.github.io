import "./index.scss";
import { createRoot } from "react-dom/client";
import React, { Suspense } from "react";
import { App } from "./app";

createRoot(document.getElementById("root") as HTMLElement).render(
  <Suspense fallback={<p>Processing data...</p>}>
    <App />
  </Suspense>
);
