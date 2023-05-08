import "./index.scss";
import { createRoot } from "react-dom/client";
import React from "react";
import { ConfigProvider, theme } from "antd";
import { App } from "./app";

createRoot(document.getElementById("root") as HTMLElement).render(
  <ConfigProvider
    theme={{
      algorithm: theme.darkAlgorithm,
    }}
  >
    <App />
  </ConfigProvider>
);
