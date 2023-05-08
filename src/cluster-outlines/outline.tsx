import React, { FC, useMemo } from "react";
import { BufferGeometry, Float32BufferAttribute } from "three";

export const Outline: FC<{
  xyContour: number[][];
  xyCenter: number[];
  zRange: number[];
}> = (props) => {
  const { xyContour, zRange } = props;
  // Return the view, these are regular Threejs elements expressed in JSX
  const lineSegments = useMemo(() => {
    const g = new BufferGeometry();
    const e: number[] = [];

    e.push(xyContour[0][0], xyContour[0][1], zRange[0]);
    for (const xyp of xyContour.slice(1)) {
      e.push(xyp[0], xyp[1], zRange[0]);
      e.push(xyp[0], xyp[1], zRange[0]);
    }
    e.push(xyContour[0][0], xyContour[0][1], zRange[0]);

    e.push(xyContour[0][0], xyContour[0][1], zRange[1]);
    for (const xyp of xyContour.slice(1)) {
      e.push(xyp[0], xyp[1], zRange[1]);
      e.push(xyp[0], xyp[1], zRange[1]);
    }
    e.push(xyContour[0][0], xyContour[0][1], zRange[1]);

    for (const xyp of xyContour) {
      e.push(xyp[0], xyp[1], zRange[0]);
      e.push(xyp[0], xyp[1], zRange[1]);
    }

    g.setAttribute("position", new Float32BufferAttribute(e, 3));

    return g;
  }, [props.xyContour]);

  return (
    <lineSegments geometry={lineSegments}>
      <lineBasicMaterial color={0xff5733} />
    </lineSegments>
  );
};
