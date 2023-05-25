import React from "react";
import type { RouteObject } from "react-router-dom";
import { ProfilePage } from "../pages/profile-page";

export const defaultRoute: RouteObject = {
  index: true,
  element: <ProfilePage />
};
