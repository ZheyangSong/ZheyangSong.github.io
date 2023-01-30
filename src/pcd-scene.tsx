import React, { FC } from "react";
import { useClusteredPCDLoader } from "./hooks";
import { Points } from "@react-three/drei";

export const PCDScene: FC<
  ReturnType<typeof useClusteredPCDLoader> & { selectedCluster?: number | null }
> = ({ clusters, allPoints, gng, selectedCluster }) => {

  if (!allPoints) {
    return;
  }

  const selectedPoints = clusters[selectedCluster];
  let highlighted: Float32Array = selectedPoints && selectedPoints.buffer;
  let baseColor = selectedPoints ? 0xffffff : 0x32cd32;

  return (
    <group>
      <Points positions={allPoints as Float32Array}>
        <pointsMaterial color={baseColor} size={0.03} />
      </Points>
      {selectedPoints && (
        <Points positions={highlighted}>
          <pointsMaterial color={0x32cd32} size={0.05} />
        </Points>
      )}
      {gng && gng.pG.length && (
        <Points positions={new Float32Array(gng.pG.flat())}>
          <pointsMaterial color={0xff0000} size={0.05} />
        </Points>
      )}
    </group>
  );
};
