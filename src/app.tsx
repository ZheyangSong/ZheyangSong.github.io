import "./app.scss";
import React, { FC, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { PCDScene } from "./pcd-scene";
import frameBinary from "../resource/pcd-binary/107.pcd";
import { useClusteredPCDLoader } from "./hooks";
import { ClusterList } from "./cluster-list";
import { Prism } from "./prism";
import { Outline } from "./outline";

export const App: FC<{}> = () => {
  const loaded = useClusteredPCDLoader(frameBinary);
  const [selectedCluster, setSelectedCID] = useState<number | null>(null);

  return (
    <>
      <div className="main-view">
        <Canvas
          camera={{
            position: [
              loaded.center.x,
              loaded.center.y,
              (loaded.radius ?? 10) * 1.3,
            ],
            fov: 60,
            up: [0, 0, 1],
          }}
        >
          <ambientLight intensity={5} />
          {/* <pointLight position={[10, 10, 10]} /> */}
          <PCDScene {...loaded} selectedCluster={selectedCluster} />
          <group>
            {loaded.clusters
              .filter(({ cId }) => cId === selectedCluster)
              .map(({ contour, cId }) => (
                <Prism key={`p-${cId}`} {...contour} />
              ))}
          </group>
          <group>
            {loaded.clusters.map(({ contour, cId }) => (
              <Outline key={`o-${cId}`} {...contour} />
            ))}
          </group>
          <CameraControls maxPolarAngle={Math.PI / 2} />
        </Canvas>
      </div>
      <div className="right-sidebar">
        <ClusterList
          {...loaded}
          onSelectCluster={(cid) => setSelectedCID(cid)}
          onDeselectCluster={() => setSelectedCID(null)}
        />
      </div>
      <div className="statistics">
        Statistics
      </div>
    </>
  );
};
