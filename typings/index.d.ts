declare module "*.pcd" {
  const data: any;

  export default data;
}

declare module "convex-hull-wp" {
  const calculator: (points: number[][]) => number[][];

  export default calculator;
}
