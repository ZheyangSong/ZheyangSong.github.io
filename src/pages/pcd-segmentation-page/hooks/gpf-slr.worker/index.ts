/**
 * refs:
 * 1. https://www.researchgate.net/publication/318325507_Fast_Segmentation_of_3D_Point_Clouds_A_Paradigm_on_LiDAR_Data_for_Autonomous_Vehicle_Applications
 * 2. https://www.researchgate.net/publication/5462954_A_Run-Based_Two-Scan_Labeling_Algorithm
 * 3. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4934329/
 */

import { GPF } from "./gpf";

onmessage = (evt) => {
  const { points } = evt.data;

  const t = GPF(points);

  self.postMessage(t);
};
