import { useState } from "react";
import { TSensorData } from "../types";
import { createFileReader, readMeasurement } from "./file-readers";

const readSensorData = createFileReader("dataurl");

export function useFileCollector(f: File[]) {
  const [files, setFiles] = useState<File[]>(f);

  const addFile = (filesToAdd: File[]) => {
    const newFilelist: File[] = [...files];

    filesToAdd.forEach((fd) => {
      if (!newFilelist.find((file) => file.name === fd.name)) {
        newFilelist.push(fd);
      }
    });

    setFiles(newFilelist);
  };

  const removeFile = (idx: number) => {
    files.splice(idx, 1);
    setFiles([...files]);
  };

  const extract = async () => {
    const pcdFiles: Record<string, File> = {};
    const sortedList = [...files].sort(
      (a, b) => calcSortweight(a.name) - calcSortweight(b.name)
    );
    const brokenMeasurementData: [string, string][] = [];

    for (let i = 0, e = sortedList.length; i < e; i++) {
      const file = sortedList[i];

      if (file.name.endsWith(".pcd")) {
        pcdFiles[file.name] = file;
      } else {
        const measurementData = await readMeasurement(file);
        const { box_pcd = "" } = measurementData;
        const [, pcdFileName] = /([^\\\/]*\.pcd)$/.exec(box_pcd) || [];

        if (pcdFiles[pcdFileName]) {
          let sensorData: TSensorData = "";

          try {
            sensorData = (await readSensorData(
              pcdFiles[pcdFileName]
            )) as TSensorData;
          } catch {}

          return {
            sensorData,
            measurementData,
          };
        } else {
          brokenMeasurementData.push([file.name, pcdFileName]);
        }
      }
    }

    let err = new Error();
    if (brokenMeasurementData.length) {
      err = new Error(JSON.stringify(brokenMeasurementData));
      err.name = MISSING_SENSOR_DATA;
    } else {
      err = new Error();
      err.name = MISSING_MEASUREMENT_DATA;
    }

    throw err;
  };

  return {
    files,
    addFile,
    removeFile,
    extract,
  };
}

function calcSortweight(name: string) {
  return name.endsWith(".pcd") ? -1 : 1;
}

export const MISSING_SENSOR_DATA = "missing sensor data file";
export const MISSING_MEASUREMENT_DATA = "missing measurement data file";
