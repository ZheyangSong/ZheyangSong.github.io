import "./app.scss";
import React, { Suspense, FC, useState, useEffect } from "react";
import { Vector3 } from "three";
import { Canvas } from "@react-three/fiber";
import { PCDScene } from "./pcd-scene";
import { HighlightedPrism } from "./highlighted-prism";
import { ClusterOutlines } from "./cluster-outlines";
import { ClusterList } from "./cluster-list";
import { DataChooser } from "./data-chooser";
import { Loader, TLoadResult } from "./loader";
import { Control } from "./control";
import {
  MeasureResultReader,
  MeasureResultReaderProps,
} from "./measure-result-reader";

const cache: { key: string; value: string }[] = [];

function importAll(r: ReturnType<typeof require.context>) {
  r.keys().forEach((key) => cache.push({ key, value: r(key) }));
}

importAll(require.context("../resource/pcd-binary/", false, /\.pcd$/));

export const App: FC<{}> = () => {
  const [filePath, setFilePath] = useState<string>(cache[0].value);
  const [measures, setMeasures] = useState<{
    width: number;
    height: number;
    length: number;
  } | undefined>();
  const [all, setAll] = useState<TLoadResult>({
    clusteredResult: {
      allPoints: [],
      center: new Vector3(0, 0, 0),
      radius: 0,
      clusters: [],
      gng: {
        pG: [],
        pNG: [],
      },
    },
    clusteringTime: Infinity,
    groundProcessingTime: Infinity,
  });
  const [selectedCluster, setSelectedCID] = useState<number | null>(null);

  const onMeasurementLoaded: MeasureResultReaderProps["onResultRead"] = ({
    sensorData,
    measurementData,
  }) => {
    setMeasures(measurementData);
    setFilePath(sensorData);
  };

  const { clusteredResult, clusteringTime, groundProcessingTime } = all;

  return (
    <>
      <Suspense fallback={<></>}>
        <Loader
          filePath={filePath}
          onDataLoaded={(args) => {
            setAll(args);
          }}
        />
      </Suspense>
      <div className="main-view">
        <Canvas
          frameloop="demand"
          camera={{
            position: [
              clusteredResult.center.x,
              clusteredResult.center.y,
              clusteredResult.center.z - (clusteredResult.radius ?? 10) * 1.3,
            ],
            fov: 60,
            up: [0, 0, 1],
          }}
        >
          <ambientLight intensity={10} />
          <PCDScene {...clusteredResult} selectedCluster={selectedCluster} />
          <HighlightedPrism
            clusters={clusteredResult.clusters}
            selected={selectedCluster}
          />
          <ClusterOutlines clusters={clusteredResult.clusters} />
          <Control sphere={clusteredResult} />
        </Canvas>
      </div>
      <div className="controller">
        <h2>Controller</h2>
        <div className="controls-panel">
        <DataChooser
          dataSrcs={cache}
          onSelectDataSrc={(filePath) =>{ setMeasures(undefined); setFilePath(filePath);}}
        />
        <MeasureResultReader onResultRead={onMeasurementLoaded} />
        </div>
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
        <div className="inner">
          <p>
            <span>Separating Ground Time: </span>
            <span>{groundProcessingTime.toFixed(3)}</span> ms
          </p>
          <p>
            <span>Clustering POI Time: </span>
            <span>{clusteringTime.toFixed(3)}</span> ms
          </p>
          {measures && <><p>
            <span>length: </span><span>{measures.length}</span> m</p>
            <p>
            <span>width: </span><span>{measures.width}</span> m</p>
            <p>
            <span>height: </span><span>{measures.height}</span> m</p>
          </>}
        </div>
      </div>
    </>
  );
};
