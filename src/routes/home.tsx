import React from "react";
import type { RouteObject } from "react-router-dom";
import { ProfilePage } from "../pages/profile-page";
import { HOME_ROUTE_PATH } from "../route-paths";

export const homeRoute: RouteObject = {
  path: HOME_ROUTE_PATH,
  element: <ProfilePage />
};
