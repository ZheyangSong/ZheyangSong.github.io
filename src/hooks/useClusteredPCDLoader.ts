import { useState, useEffect } from "react";
import { BufferAttribute } from "three";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";
import { useLoader } from "@react-three/fiber";
import { swarm, REQ_EARLY_TERMINATION_TOKEN } from "worker-swarmer";
import { groundPointFitting } from './gpf-slr';

type IClusters = {
  buffer: Float32Array;
  pIndices: number[];
  cId: number;
  contour: {
    xyContour: number[][];
    xyCenter: number[];
    zRange: number[];
  };
}[];

const dbscanClusterer = swarm<{ points: BufferAttribute }, IClusters>(
  () => new Worker(new URL("./dbscan.worker.ts", import.meta.url)),
  {
    maxCount: 2,
  }
);
// const groundClassifier = swarm<
//   { points: BufferAttribute },
//   { pG: number[][]; pNG: number[][] }
// >(() => new Worker(new URL("./gpf-slr.worker/index.ts", import.meta.url)), {
//   maxCount: 2,
// });

export function useClusteredPCDLoader(filePath: string) {
  const result = useLoader(PCDLoader, filePath);
  const allPoints = (result.geometry.attributes.position as BufferAttribute)
    .array;
  const [clusteredResult, setClusteredResult] = useState({
    allPoints,
    radius: result.geometry.boundingSphere.radius,
    center: result.geometry.boundingSphere.center,
    clusters: [] as IClusters,
    gng: { pG: [], pNG: [] } as { pG: number[][]; pNG: number[][] },
  });
  const [groundProcessingTime, logGroundProcessingTime] = useState(Infinity);
  const [clusteringTime, logClusteringTime] = useState(Infinity);

  console.log(result);
  useEffect(() => {
    logGroundProcessingTime(Infinity);
    logClusteringTime(Infinity);
    let measureStart = performance.now();

    groundPointFitting(result.geometry.attributes.position as BufferAttribute, 10)
    // groundClassifier({
    //   points: result.geometry.attributes.position as BufferAttribute,
    // })
      .then((gng) => {
        // if (gng !== REQ_EARLY_TERMINATION_TOKEN) {
          setClusteredResult((prevState) => ({
            ...prevState,
            gng,
          }));

          logGroundProcessingTime(performance.now() - measureStart);

          measureStart = performance.now();

          return dbscanClusterer({
            points: new BufferAttribute(new Float32Array(gng.pNG.flat()), 3),
          });
        // }
      })
      .then((clusters) => {
        if (clusters !== REQ_EARLY_TERMINATION_TOKEN) {
          setClusteredResult((prevState) => ({
            ...prevState,
            clusters,
          }));

          logClusteringTime(performance.now() - measureStart);
        }
      });
  }, [filePath]);

  return {
    clusteredResult,
    groundProcessingTime,
    clusteringTime,
  };
}
