import React, { FC } from "react";
import { Vector3 } from "three";
import { IMeasureMeta } from "../types";
import { Box, Line } from "@react-three/drei";
import { Word } from "./word";

export type IMeasuredBBoxProps = IMeasureMeta;

export const MeasuredBBox: FC<IMeasuredBBoxProps> = ({
  max,min, length, width, height
}) => {
  if (min.length < 3 || max.length < 3) {
    return <></>;
  }

  const fontSize = 36;
  const fontOffset = fontSize + 2;

  const xLen = max[0] - min[0];
  const yLen = max[1] - min[1];
  const zLen = max[2] - min[2];
  const pos = new Vector3((max[0] + min[0]) / 2, (max[1] + min[1]) / 2, (max[2] + min[2]) / 2);
  const lPos = new Vector3(-((xLen + fontOffset) / 2), 0, -((zLen + fontOffset) / 2)).add(pos);
  const wPos = new Vector3(0, -((yLen + fontOffset) / 2), -((zLen + fontOffset) / 2)).add(pos);
  const hPos = new Vector3(-((xLen + fontOffset) / 2), -((yLen + fontOffset) / 2), 0).add(pos);
  const points: [number, number, number][] = [
    // bottom planar
    [-1/2, -1/2, -1/2], [-1/2, 1/2, -1/2],
    [-1/2, 1/2, -1/2], [1/2, 1/2, -1/2],
    [1/2, 1/2, -1/2], [1/2, -1/2, -1/2],
    [1/2, -1/2, -1/2], [-1/2, -1/2, -1/2],
    // top planar
    [-1/2, -1/2, 1/2], [-1/2, 1/2, 1/2],
    [-1/2, 1/2, 1/2], [1/2, 1/2, 1/2],
    [1/2, 1/2, 1/2], [1/2, -1/2, 1/2],
    [1/2, -1/2, 1/2], [-1/2, -1/2, 1/2],

    [1/2, 1/2, -1/2], [1/2, 1/2, 1/2],
    [-1/2, -1/2, -1/2], [-1/2, -1/2, 1/2],
    [1/2, -1/2, -1/2], [1/2, -1/2, 1/2],
    [-1/2, 1/2, -1/2], [-1/2, 1/2, 1/2],
  ].map(([ruX, ruY, ruZ]) => [pos.x + ruX * xLen, pos.y + ruY * yLen, pos.z + ruZ * zLen]);

  return <>

<Box args={[xLen, yLen, zLen]} position={[pos.x, pos.y, pos.z]} material-color="red" material-opacity={0.6} material-transparent={true}/>
<Line points={points} color="yellow" lineWidth={1.5} segments />
<Word color="yellow" fontSize={fontSize} position={lPos} anchorX="-50%">{length} m</Word>
      <Word color="yellow" fontSize={fontSize} position={wPos} anchorX="-50%">{width} m</Word>
      <Word color="yellow" fontSize={fontSize} position={hPos} rotateByZ={90} anchorX="-50%">{height} m</Word>
  </>
}
