import { BufferAttribute } from "three";
import { dbscan } from "point-cloud-clustering";

onmessage = (evt) => {
  const {
    points,
  } = evt.data;

  const clusters = doClustering(points);

  self.postMessage(clusters);
}

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
  const clusters = dbscan(points, { epsilon: 0.01, minPts: 4 });
  console.timeEnd("clustering");
  console.log(clusters);

  const ret = clusters.map((pIndices, cId) => ({
    pIndices,
    cId,
    buffer: genArrays(pIndices, posAttr),
  }));

  return ret;
}

function genArrays(pointIndices: number[], points: BufferAttribute) {
  const arr = points.array;
  const size = points.itemSize;
  const positions = new Float32Array(pointIndices.length * size);

  for (let i = 0; i < pointIndices.length; i++) {
    const idx = pointIndices[i];

    for (let j = 0; j < size; j++) {
      positions[i * size + j] = (arr as Float32Array)[idx * size + j];
    }
  }

  return positions;
}
