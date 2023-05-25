import React from "react";
import {
  createBrowserRouter
} from "react-router-dom";
import { RootPage } from "../pages/root-page";
import { NotFoundPage } from "../pages/not-found-page";
import { defaultRoute } from "./default";
import { homeRoute } from "./home";
import { pcdSegmentationRoute } from "./pcd-segmentation";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    errorElement: <NotFoundPage />,
    children: [
      defaultRoute,
      homeRoute,
      pcdSegmentationRoute,
    ]
  },
]);
