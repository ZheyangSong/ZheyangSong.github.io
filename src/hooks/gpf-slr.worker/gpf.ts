import { Matrix, SingularValueDecomposition } from 'ml-matrix';

export function GPF(points: number[][], { maxItrs = 50, nLPR = 50, thSeed = 0.02, thDist = 0.12 }: Partial<{ maxItrs: number; nLPR: number; thSeed: number; thDist: number; }> = {}) {
  let pG = extractInitialSeeds(points, nLPR, thSeed);
  let pNG: number[][] = [];

  process.env.NODE_ENV === "development" && console.time('gpf');
  for (let i = 0; i < maxItrs; i++) {
    const planeG = estimatePlane(pG);

    pG = [];
    pNG = [];
    for (const p of points) {
      if (distanceToGround(p, planeG) < thDist) {
        pG.push(p);
      } else {
        pNG.push(p);
      }
    }
  }
  process.env.NODE_ENV === "development" && console.timeEnd('gpf');

  return {
    pG, pNG
  };
}

function extractInitialSeeds(points: number[][], nLPR: number, thSeed: number) {
  const sorted = [...points].sort((a, b) => a[2] - b[2]);

  const lpr = avg(sorted.slice(0, nLPR));

  const seeds = points.filter(p => p[2] < lpr[2] + thSeed);

  return seeds;
}

function avg(points: number[][]) {
  const sum = points.reduce((s, p) => {
    s[0] += p[0];
    s[1] += p[1];
    s[2] += p[2];

    return s;
  }, [0, 0, 0]);

  const n = points.length;

  return [sum[0] / n, sum[1] / n, sum[2] / n];
}

function estimatePlane(points: number[][]) {
  const pAvg = avg(points);
  const cov = points.reduce((cm, p) => {
    const diff = [p[0] - pAvg[0], p[1] - pAvg[1], p[2] - pAvg[2]];
    const op = outerProduct3(diff, diff);

    return matrixSum3(cm, op);
  }, [[0, 0, 0], [0, 0, 0], [0, 0, 0]]);

  const svd = new SingularValueDecomposition(new Matrix(cov));
  const n = svd.leftSingularVectors.getColumn(2);
  const d = -(pAvg[0] * n[0] + pAvg[1] * n[1] + pAvg[2] * n[2]);

  return {
    n, d,
  };
}

function outerProduct3(v1: number[], v2: number[]) {
  return [
    [v1[0] * v2[0], v1[0] * v2[1], v1[0] * v2[2]],
    [v1[1] * v2[0], v1[1] * v2[1], v1[1] * v2[2]],
    [v1[2] * v2[0], v1[2] * v2[1], v1[2] * v2[2]],
  ];
}

function matrixSum3(m1: number[][], m2: number[][]) {
  return [
    [m1[0][0] + m2[0][0], m1[0][1] + m2[0][1], m1[0][2] + m2[0][2]],
    [m1[1][0] + m2[1][0], m1[1][1] + m2[1][1], m1[1][2] + m2[1][2]],
    [m1[2][0] + m2[2][0], m1[2][1] + m2[2][1], m1[2][2] + m2[2][2]],
  ];
}

function distanceToGround(point: number[], ground: {n: number[]; d: number}) {
  return Math.abs(point[0] * ground.n[0] + point[1] * ground.n[1] + point[2] * ground.n[2] + ground.d) / Math.sqrt(ground.n[0] * ground.n[0] + ground.n[1] * ground.n[1] + ground.n[2] * ground.n[2]);
}
