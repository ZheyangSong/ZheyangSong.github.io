import "./app.scss";
import React, { FC, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { PCDScene } from "./pcd-scene";
import { useClusteredPCDLoader } from "./hooks";
import { ClusterList } from "./cluster-list";
import { Prism } from "./prism";
import { Outline } from "./outline";
import { DataChooser } from "./data-chooser";

const cache: { key: string; value: string }[] = [];

function importAll(r: ReturnType<typeof require.context>) {
  r.keys().forEach((key) => cache.push({key, value: r(key)}));
}

importAll(require.context('../resource/pcd-binary/', false, /\.pcd$/));

export const App: FC<{}> = () => {
  const [filePath, setFilePath] = useState<string>(cache[0].value)
  const { clusteredResult, clusteringTime, groundProcessingTime } = useClusteredPCDLoader(filePath);
  const [selectedCluster, setSelectedCID] = useState<number | null>(null);

  return (
    <>
      <div className="main-view">
        <Canvas
          camera={{
            position: [
              clusteredResult.center.x,
              clusteredResult.center.y,
              (clusteredResult.radius ?? 10) * 1.3,
            ],
            fov: 60,
            up: [0, 0, 1],
          }}
        >
          <ambientLight intensity={10} />
          {/* <pointLight position={[10, 10, 10]} /> */}
          <PCDScene {...clusteredResult} selectedCluster={selectedCluster} />
          <group>
            {clusteredResult.clusters
              .filter(({ cId }) => cId === selectedCluster)
              .map(({ contour, cId }) => (
                <Prism key={`p-${cId}`} {...contour} />
              ))}
          </group>
          <group>
            {clusteredResult.clusters.map(({ contour, cId }) => (
              <Outline key={`o-${cId}`} {...contour} />
            ))}
          </group>
          <CameraControls maxPolarAngle={Math.PI / 2} />
        </Canvas>
      </div>
      <div className="controller">
        <h2>Controller</h2>
        <DataChooser dataSrcs={cache} onSelectDataSrc={(filePath) => setFilePath(filePath)} />
      </div>
      <div className="right-sidebar">
        <ClusterList
          {...clusteredResult}
          onSelectCluster={(cid) => setSelectedCID(cid)}
          onDeselectCluster={() => setSelectedCID(null)}
        />
      </div>
      <div className="statistics">
        <h2>Statistics</h2>
        <p><span>Separating Ground Time: </span><span>{groundProcessingTime.toFixed(3)}</span> ms</p>
        <p><span>Clustering POI Time: </span><span>{clusteringTime.toFixed(3)}</span> ms</p>
      </div>
    </>
  );
};
