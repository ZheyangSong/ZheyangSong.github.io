import "./component.scss";

import React, { FC, useState, DragEventHandler } from "react";
import { Button, ButtonProps } from "antd";
import {
  useFileCollector,
  MISSING_MEASUREMENT_DATA,
  MISSING_SENSOR_DATA,
} from "./hooks";
import { FileList } from "./file-list";
import { IMeasurement, TSensorData } from "./types";

export interface MeasureResultReaderProps {
  onResultRead: (data: {
    sensorData: TSensorData;
    measurementData: Pick<IMeasurement, "height" | "length" | "width"> & { min: number[]; max: number[]; };
  }) => void;
}

const list: File[] = [];

export const MeasureResultReader: FC<MeasureResultReaderProps> = ({ onResultRead }) => {
  const { files, addFile, removeFile, extract } = useFileCollector(list);
  const [dropzoneVisible, setDropzoneVisible] = useState(false);
  const [fileInReading, setFileInReading] = useState(false);
  const [extractionErrors, setExtractionErrors] = useState({
    generalError: '',
    mFileErrors: new Map<string, string>()
  })

  const handleFiledrop: DragEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropzoneVisible(false);
    const filesToAdd = e.dataTransfer.files;

    addFile([...files, ...Array.from(filesToAdd)]);
  };

  const handleFiledragover: DragEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const showDropzone: DragEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropzoneVisible(true);
  };

  const hideDropzone: DragEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropzoneVisible(false);
  };

  const onCheckAndLoad: ButtonProps["onClick"] = async () => {
    setExtractionErrors((prevErrors) => {
    prevErrors.generalError = '';
    prevErrors.mFileErrors.clear();
    
    return{
      ...prevErrors
    }});
    setFileInReading(true);

    try {
      const { sensorData, measurementData } = await extract();

      onResultRead({
        sensorData,
        measurementData: {
          height: measurementData?.height ?? 0,
          width: measurementData?.width ?? 0,
          length: measurementData?.length ?? 0,
          min: measurementData?.diagonal.slice(0, 3),
          max: measurementData?.diagonal.slice(3),
        },
      });
    } catch (e) {
      const extractError = e as Error;

      if (extractError.name === MISSING_SENSOR_DATA) {
        const fileErrors = JSON.parse(extractError.message) as [
          string,
          string
        ][];
        setExtractionErrors((prevErrors) => {
          fileErrors.forEach(
            ([mFileName, sFileName]) =>{
              prevErrors.mFileErrors.set(mFileName, `Not found "${sFileName}" referenced by ${mFileName}`);
            })
          prevErrors.generalError = '';
          
          return{
            ...prevErrors
          }}
        );
      } else if (extractError.name === MISSING_MEASUREMENT_DATA) {
        setExtractionErrors((prevErrors) => {
          prevErrors.generalError = "No measurement file is found";
          prevErrors.mFileErrors.clear();

          return{
            ...prevErrors
          }});
      }
    }

    setFileInReading(false);
  };

  return (
    <div
      className="measure-result-reader"
      onDragEnterCapture={showDropzone}
      onDragOverCapture={handleFiledragover}
      onDropCapture={handleFiledrop}
    >
      {!!files.length && (
        <>
          <FileList files={files} onRemove={removeFile} errors={extractionErrors}/>
          <Button onClick={onCheckAndLoad} disabled={fileInReading}>
            Check and Load
          </Button>
        </>
      )}

      {(dropzoneVisible || files.length === 0)&& (
        <div className="drop-zone-indicator"
          onDragLeaveCapture={hideDropzone}>
          <div className="inner">Drop to Analyze the PCD data</div>
        </div>
      )}
    </div>
  );
};
