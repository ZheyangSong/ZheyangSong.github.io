import React, { FC, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { IClusters} from '../hooks';
import { Prism } from "./prism";

export const HighlightedPrism: FC<{ clusters: IClusters; selected: IClusters[0]['cId'] }> = ({clusters, selected}) => {
  const { invalidate } = useThree();

  useEffect(() => {
    invalidate();
  }, [selected]);

  return <group>
  {clusters
    .filter(({ cId }) => cId === selected)
    .map(({ contour, cId }) => (
      <Prism key={`p-${cId}`} {...contour} />
    ))}
</group>
}
