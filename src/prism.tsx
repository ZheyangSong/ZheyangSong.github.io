import React, { FC, useMemo } from "react";
import { Shape } from "three";

export const Prism: FC<{
  xyContour: number[][];
  xyCenter: number[];
  zRange: number[];
}> = (props) => {
  const { xyContour, zRange } = props;
  // Return the view, these are regular Threejs elements expressed in JSX
  const polygon = useMemo(() => {
    const s = new Shape();
    s.moveTo(xyContour[0][0], xyContour[0][1]);
    xyContour.slice(1).forEach(([x, y]) => s.lineTo(x, y));
    s.lineTo(xyContour[0][0], xyContour[0][1]);

    return s;
  }, [props.xyContour]);

  return (
    <mesh position={[0, 0, zRange[0]]}>
      <extrudeGeometry
        args={[polygon, { depth: (zRange[1] - zRange[0])}]}
      />
      <meshBasicMaterial color="yellow" transparent opacity={0.3} />
    </mesh>
  );
};
