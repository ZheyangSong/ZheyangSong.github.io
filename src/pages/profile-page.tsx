import React, { FC } from 'react';
import { List, Typography, Tooltip } from "antd";
import { PCD_SEGMENTATION_PATH } from '../route-paths';

const { Paragraph, Link, Text } = Typography;
const { Item } = List;

export const ProfilePage: FC<{}> = () => {
  const pcdSegmentationProjectIntro = "This is a side project that exploring \
  the possibility of processing typical point cloud data collected \
  by autonomous vehicles in real-time using just resources provided \
  by browsers. Specifically, it'll try to run certain CV algorithms (non-neural-network approach) \
  to performance PCD segmentation task. \
  In the future, sematics can be introduced with neural networks and \
  used to enable sematic coloring.";

  return <Typography style={{padding: "10px 20px"}}>
  <Paragraph>
    <Text>My Profiles:</Text>
    <ul>
      <li><Link href="https://www.linkedin.com/in/zheyangsong/" target="zys-linkedin">LinkedIn</Link></li>
      <li><Link href="https://github.com/ZheyangSong/" target="zys-github">Github</Link></li>
    </ul>
  </Paragraph>
  <Paragraph>
    This Github Pages hosts my personal projects for various purposes:
  </Paragraph>
  <div>
    <List size="small">
      <Item>exploring new browser technologies, new CV/ML algorithms. Such as <Tooltip title={pcdSegmentationProjectIntro}><Link href={PCD_SEGMENTATION_PATH}>Real-time PCD Segmentation</Link></Tooltip></Item>
      <Item>demonstrating some personal open-source projects</Item>
      <Item>...</Item>
    </List>
  </div>
  </Typography>
};
