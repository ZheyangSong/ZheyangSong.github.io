/**
 * refs:
 * 1. https://www.researchgate.net/publication/318325507_Fast_Segmentation_of_3D_Point_Clouds_A_Paradigm_on_LiDAR_Data_for_Autonomous_Vehicle_Applications
 * 2. https://www.researchgate.net/publication/5462954_A_Run-Based_Two-Scan_Labeling_Algorithm
 * 3. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4934329/
 */

import { BufferAttribute } from "three";
import { GPF } from "./gpf";

onmessage = (evt) => {
  const { points } = evt.data;

  const ps = toPointArr(points);
  ps.sort((a, b) => a[0] - b[0]);

  const all: { pG: number[][]; pNG: number[][] } = {
    pG: [],
    pNG: [],
  };
  const N = 100;
  const step = Math.ceil(ps.length / N);

  process.env.NODE_ENV === "development" && console.time("gpf");
  for (let i = 0; i < N; i++) {
    const t = GPF(ps.slice(i * step, Math.min((i + 1) * step, ps.length)));

    all.pG.push(...t.pG);
    all.pNG.push(...t.pNG);
  }
  process.env.NODE_ENV === "development" && console.timeEnd("gpf");
  console.log(all);

  self.postMessage(all);
};

function toPointArr(posAttr: BufferAttribute) {
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

  return points;
}
