import { useState, useEffect } from "react";
import { BufferAttribute } from "three";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";
import { useLoader } from "@react-three/fiber";
import { swarm, REQ_EARLY_TERMINATION_TOKEN } from "worker-swarmer";

type IClusters = { buffer: Float32Array; pIndices: number[]; cId: number; }[];

const dbscanClusterer = swarm<{points: BufferAttribute}, IClusters>(() => new Worker(new URL('./dbscan.worker.ts', import.meta.url)), {
  maxCount: 2,
});

export function useClusteredPCDLoader(filePath: string) {
  const result = useLoader(PCDLoader, filePath);
  const [clusteredResult, setClusteredResult] = useState({
    result: null,
    clusters: [] as IClusters,
  });

  useEffect(() => {
    dbscanClusterer({
      points: result.geometry.attributes.position as BufferAttribute,
    }).then((clusters) => {
      if (clusters !== REQ_EARLY_TERMINATION_TOKEN) {
        setClusteredResult({
          result,
          clusters,
        });
      }
    });
  }, [filePath]);

  return clusteredResult;
}
