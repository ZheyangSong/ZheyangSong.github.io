import React, { FC, useMemo, useRef, useEffect } from "react";
import { useClusteredPCDLoader } from "./hooks";
import { Points } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

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
  const keying = useRef(0);
  let highlighted: Float32Array = selectedPoints && selectedPoints.buffer;
  let baseColor = selectedPoints ? 0xffffff : 0x32cd32;
  const { invalidate } = useThree();

  useEffect(() => {
    keying.current++;
  }, [allPoints]);

  useEffect(() => {
    invalidate();
  }, [allPoints, gng, selectedCluster, clusters]);

  return (
    <group>
      {selectedPoints && (
        <Points key={selectedCluster} positions={highlighted}>
          <pointsMaterial color={0x32cd32} size={0.1} />
        </Points>
      )}
      <Points key={`${keying.current}-main`} positions={allPoints as Float32Array}>
        <pointsMaterial color={baseColor} size={0.05} />
      </Points>
      {gng && gng.pG.length && (
        <Points key={`${keying.current}-ground`} positions={new Float32Array(gng.pG.flat())}>
          <pointsMaterial color={0xff0000} size={0.05} />
        </Points>
      )}
    </group>
  );
};
