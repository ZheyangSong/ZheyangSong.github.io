import { BufferAttribute } from "three";
import { swarm, REQ_EARLY_TERMINATION_TOKEN } from "worker-swarmer";

const groundClassifier = swarm<
  { points: number[][] },
  { pG: number[][]; pNG: number[][] }
>(() => new Worker(new URL("./gpf-slr.worker/index.ts", import.meta.url)), {
  maxCount: 10,
});

export function groundPointFitting(points: BufferAttribute, segmentCount: number = 10) {
  const { array: rawArray, count, itemSize } = points;
  console.time('prep');
  const indices = new Array(count).fill(0).map((_, idx) => idx);

  indices.sort((a, b) => rawArray[a * itemSize] - rawArray[b * itemSize]);

  const segments: number[][][] = [];
  const step = Math.ceil(indices.length / segmentCount);
  for (let i = 0; i < segmentCount; i++) {
    const segment = indices
      .slice(i * step, Math.min((i + 1) * step, indices.length))
      .map(idx => [0, 1, 2].map(offset => rawArray[idx * itemSize + offset]));
    segments.push(segment);
  }
  console.timeEnd('prep');

  return Promise.all(segments.map(seg => groundClassifier({ points: seg })))
    .then((result) => result.reduce<{ pG: number[][]; pNG: number[][]}>((c, cs) => {
      if (cs !== REQ_EARLY_TERMINATION_TOKEN) {
        c.pG.push(...cs.pG);
        c.pNG.push(...cs.pNG);
      }

      return c;
    }, { pG: [], pNG: []}));
}