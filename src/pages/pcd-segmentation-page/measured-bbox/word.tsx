import React, { FC, useRef, PropsWithChildren } from "react";
import { Text } from "@react-three/drei";
import { Color, useFrame } from "@react-three/fiber";
import { Mesh, Vector3, Quaternion, MathUtils } from "three";

export type IWordProps = PropsWithChildren<{
  color?: Color;
  position?: Vector3;
  rotateByZ?: number;
  anchorX?: number | string | "center" | "left" | "right";
  anchorY?: number | string | "bottom" | "bottom-baseline" | "top" | "top-baseline";
  fontSize?: number;
}>;

export const Word: FC<IWordProps> = ({
  color = "yellow", children, position, rotateByZ,
  fontSize,
}) => {
  const ref = useRef<Mesh>();
  let rq: Quaternion;

  if (rotateByZ) {
    rq = new Quaternion();
    rq.setFromAxisAngle(new Vector3(0, 0, 1), MathUtils.degToRad(rotateByZ)).normalize();
  }

  useFrame(({ camera }) => {
    ref.current!.quaternion.copy(camera.quaternion);

    if (rq) {
      ref.current!.quaternion.multiply(rq);
    }
  });

  return <Text ref={ref}
    fontSize={fontSize}
    color={color}
    position={position}
    characters="0123456789-.m "
    children={children} />
}
