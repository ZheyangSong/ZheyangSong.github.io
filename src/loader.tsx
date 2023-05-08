import React, { FC, useEffect } from 'react';
import { useClusteredPCDLoader } from "./hooks";

export type TLoadResult = ReturnType<typeof useClusteredPCDLoader>;

export const Loader: FC<{filePath: string; onDataLoaded: (args: TLoadResult) => void;}> = ({filePath, onDataLoaded}) => {
  const { clusteredResult, clusteringTime, groundProcessingTime } =
    useClusteredPCDLoader(filePath);

  useEffect(() => {
    onDataLoaded({ clusteredResult, clusteringTime, groundProcessingTime });
  }, [clusteredResult, clusteringTime, groundProcessingTime]);

  return <></>
}
