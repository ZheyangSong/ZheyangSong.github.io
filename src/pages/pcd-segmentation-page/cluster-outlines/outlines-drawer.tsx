import React, { FC } from "react";
import { IClusters } from '../hooks';
import { Outline } from "./outline";

export const ClusterOutlines: FC<{ clusters: IClusters; }> = ({clusters}) => {
  return <group>
  {clusters.map(({ contour, cId }) => (
    <Outline key={`o-${cId}`} {...contour} />
  ))}
</group>
}