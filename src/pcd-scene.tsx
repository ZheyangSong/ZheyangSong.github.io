import React, { FC, useMemo } from "react";
import { useClusteredPCDLoader } from "./hooks";
import { Points } from "@react-three/drei";

type TLoadedData = ReturnType<typeof useClusteredPCDLoader>['clusteredResult'];

export const PCDScene: FC<
  TLoadedData & { selectedCluster?: number | null }
> = ({ clusters, allPoints, gng, selectedCluster }) => {
  if (!allPoints) {
    return;
  }

  const clusterMap = useMemo(
    () =>
      clusters.reduce((m, c) => {
        m[c.cId] = c;

        return m;
      }, {} as Record<number, TLoadedData["clusters"][0]>),
    [clusters]
  );
  const selectedPoints = clusterMap[selectedCluster];
  let highlighted: Float32Array = selectedPoints && selectedPoints.buffer;
  let baseColor = selectedPoints ? 0xffffff : 0x32cd32;

  return (
    <group>
      {selectedPoints && (
        <Points key={selectedCluster} positions={highlighted}>
          <pointsMaterial color={0x32cd32} size={0.1} />
        </Points>
      )}
      <Points positions={allPoints as Float32Array}>
        <pointsMaterial color={baseColor} size={0.05} />
      </Points>
      {gng && gng.pG.length && (
        <Points positions={new Float32Array(gng.pG.flat())}>
          <pointsMaterial color={0xff0000} size={0.05} />
        </Points>
      )}
    </group>
  );
};
