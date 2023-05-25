import React from "react";
import type { RouteObject } from "react-router-dom";
import { PCDSegmentationPage } from "../pages/pcd-segmentation-page";
import { PCD_SEGMENTATION_PATH } from "../route-paths";

export const pcdSegmentationRoute: RouteObject = {
  path: PCD_SEGMENTATION_PATH,
  element: <PCDSegmentationPage />
};
