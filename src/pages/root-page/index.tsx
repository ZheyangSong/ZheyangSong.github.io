import "./index.scss";
import React, { FC, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";
import { Menu, Layout } from "antd";
import { HOME_ROUTE_PATH, PCD_SEGMENTATION_PATH } from '../../route-paths';

const { Header, Content } = Layout;

const items: MenuProps["items"] = [
  {
    label: "Home",
    key: HOME_ROUTE_PATH,
  },
  {
    label: "PCD Segmantation",
    key: PCD_SEGMENTATION_PATH,
  },
];

export const RootPage: FC<{}> = () => {
  const loc = useLocation();
  const [current, setCurrent] = useState(
    (loc.pathname === "/" ? items[0]!.key : loc.pathname) as string
  );
  const navigate = useNavigate();

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    navigate(e.key);
  };

  return (
    <Layout id="root-page">
      <Header id="nav-header">
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
        />
      </Header>
      <Content id="main-content">
        <Outlet />
      </Content>
    </Layout>
  );
};
