import { BufferAttribute } from "three";
import { dbscan } from "point-cloud-clustering";
import convexHull from "convex-hull-wp";

onmessage = (evt) => {
  const { points } = evt.data;

  const clusters = doClustering(points);

  self.postMessage(clusters);
};

function doClustering(posAttr: BufferAttribute) {
  const arr = posAttr.array;
  const step = posAttr.itemSize;
  const points = new Array<number[]>(arr.length / step);

  for (let i = 0; i < arr.length; i += step) {
    const cord = new Array(step);

    for (let j = 0; j < step; j++) {
      cord[j] = arr[i + j];
    }

    points[i / step] = cord;
  }
  console.time("clustering");
  const clusters = dbscan(points, { epsilon: 0.8, minPts: 4 });
  console.timeEnd("clustering");
  console.log(clusters);

  const ret = clusters.map((pIndices, cId) => {
    const points = getPoints(pIndices, posAttr);

    return {
      pIndices,
      cId,
      buffer: new Float32Array(points.flat()),
      contour: genContour(points),
    };
  });

  return ret;
}

function getPoints(pointIndices: number[], points: BufferAttribute) {
  const arr = points.array;
  const size = points.itemSize;
  const positions = new Array(pointIndices.length);

  for (let i = 0; i < pointIndices.length; i++) {
    const idx = pointIndices[i];
    const cp: number[] = [];

    for (let j = 0; j < size; j++) {
      cp[j] = (arr as Float32Array)[idx * size + j];
    }

    positions[i] = cp;
  }

  return positions;
}

function genContour(points: number[][]) {
  const xyContour = convexHull(points.map(([x, y]) => [x, y]));
  const zRange = [Infinity, -Infinity];
  const xRange = [Infinity, -Infinity];
  const yRange = [Infinity, -Infinity];

  points.forEach(([x, y, z]) => {
    xRange[0] = Math.min(xRange[0], x);
    xRange[1] = Math.max(xRange[1], x);

    yRange[0] = Math.min(yRange[0], y);
    yRange[1] = Math.max(yRange[1], y);

    zRange[0] = Math.min(zRange[0], z);
    zRange[1] = Math.max(zRange[1], z);
  });

  return {
    xyContour,
    xyCenter: [(xRange[1] + xRange[0]) / 2, (yRange[1] + yRange[0]) / 2],
    zRange,
  };
}
