import "./app.scss";
import React, { FC, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { Box } from "./box";
import { PCDScene } from "./pcd-scene";
import frameBinary from "../resource/pcd-binary/107.pcd";
import { useClusteredPCDLoader } from "./hooks";
import { ClusterList } from "./cluster-list";

export const App: FC<{}> = () => {
  const loaded = useClusteredPCDLoader(frameBinary);
  const [selectedCluster, setSelectedCID] = useState<number | null>(null);

  return (
    <>
      <div className="main-view">
        <Canvas camera={{ position: [0, 0, (loaded.result?.geometry.boundingSphere.radius ?? 10) * 2.3], fov: 60, up: [0, 0, 1] }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <PCDScene {...loaded} selectedCluster={selectedCluster}/>
          <CameraControls maxPolarAngle={Math.PI / 2}/>
        </Canvas>
      </div>
      <div className="right-sidebar">
        <ClusterList {...loaded} onSelectCluster={(cid) => setSelectedCID(cid)} onDeselectCluster={() => setSelectedCID(null)}/>
      </div>
    </>
  );
};
