import { useState, useEffect } from "react";
import { BufferAttribute } from "three";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";
import { useLoader } from "@react-three/fiber";
import { swarm, REQ_EARLY_TERMINATION_TOKEN } from "worker-swarmer";

type IClusters = { buffer: Float32Array; pIndices: number[]; cId: number; }[];

const dbscanClusterer = swarm<{points: BufferAttribute}, IClusters>(() => new Worker(new URL('./dbscan.worker.ts', import.meta.url)), {
  maxCount: 2,
});
const groundClassifier = swarm<{points: BufferAttribute}, { pG: number[][]; pNG: number[][]}>(() => new Worker(new URL('./gpf-slr.worker/index.ts', import.meta.url)), {
  maxCount: 2,
})

export function useClusteredPCDLoader(filePath: string) {
  const result = useLoader(PCDLoader, filePath);
  const allPoints = (result.geometry.attributes.position as BufferAttribute).array;
  const [clusteredResult, setClusteredResult] = useState({
    allPoints,
    radius: result.geometry.boundingSphere.radius,
    center: result.geometry.boundingSphere.center,
    clusters: [] as IClusters,
    gng: {pG: [], pNG: []} as {pG: number[][]; pNG: number[][];}
  });

  useEffect(() => {
    dbscanClusterer({
      points: result.geometry.attributes.position as BufferAttribute,
    }).then((clusters) => {
      if (clusters !== REQ_EARLY_TERMINATION_TOKEN) {
        setClusteredResult((prevState) => ({
          ...prevState,
          clusters,
        }));
      }
    });

    groundClassifier({
      points: result.geometry.attributes.position as BufferAttribute,
    }).then((gng) => {
      if (gng !== REQ_EARLY_TERMINATION_TOKEN) {
        setClusteredResult((prevState) => ({
          ...prevState,
          gng,
        }));
      }
    });
  }, [filePath]);

  return clusteredResult;
}
