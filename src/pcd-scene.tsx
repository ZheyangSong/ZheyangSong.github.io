import React, { FC } from "react";
import { useClusteredPCDLoader } from "./hooks";
import { PointsMaterial } from "three";
import { Points } from "@react-three/drei";

export const PCDScene: FC<
  ReturnType<typeof useClusteredPCDLoader> & { selectedCluster?: number | null }
> = ({ clusters, result, selectedCluster }) => {

  if (!result) {
    return;
  }

  const material = result.material as PointsMaterial;
  material.size = 0.01;
  material.needsUpdate = true;
  let highlighted: Float32Array;

  const selectedPoints = clusters[selectedCluster];

  if (selectedPoints) {
    material.color.setHex(0xffffff);
console.log(selectedPoints)
    highlighted = selectedPoints.buffer;
  } else {
    material.color.setHex(0x32cd32);
  }
  return (
    <group>
      !selectedPoints && <primitive object={result} />
      {selectedPoints && (
        <Points positions={highlighted}>
          <pointsMaterial color={0x32cd32} size={0.3} />
        </Points>
      )}
    </group>
  );
};
