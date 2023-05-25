import "./index.scss";
import React from "react";
import { createRoot } from "react-dom/client";
import {
  RouterProvider
} from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import { router } from "./routes";

createRoot(document.getElementById("root") as HTMLElement).render(
  <ConfigProvider
    theme={{
      algorithm: theme.darkAlgorithm,
    }}
  >
    <RouterProvider router={router} />
  </ConfigProvider>
);
