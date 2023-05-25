import React, { FC, useEffect, useRef } from "react";
import { Vector3, Sphere } from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";

export const Control: FC<{
  sphere: { center: Vector3; radius: number } | null;
}> = ({ sphere }) => {
  const { invalidate } = useThree();
  const cameraController = useRef<CameraControls>(null);
  useFrame((state) => {
    const newFarPlane = (sphere?.radius ?? 10) * 3;

    if (state.camera.far !== newFarPlane) {
      state.camera.far = newFarPlane;
      state.camera.updateProjectionMatrix();
    }
  });

  useEffect(() => {
    if (cameraController.current && sphere) {
      (async () => {
        await cameraController.current?.fitToSphere(
          new Sphere(sphere.center, sphere.radius),
          false
        );
        await cameraController.current?.setLookAt(
          sphere.center.x,
          sphere.center.y,
          sphere.center.z - sphere.radius * 1.3,
          sphere.center.x,
          sphere.center.y,
          sphere.center.z,
          false
        );
        invalidate();
      })();
    }
  }, [sphere]);

  return (
    <CameraControls
      ref={cameraController}
      maxPolarAngle={Math.PI / 2}
      minDistance={10}
      minZoom={0.01}
      maxDistance={1100}
      onChange={() => invalidate()}
    />
  );
};
