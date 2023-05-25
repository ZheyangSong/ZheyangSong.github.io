import "./list-item.scss";
import React, { FC, ReactNode } from "react";
import { Button, Tooltip } from "antd";
import { IFileListItemProps } from "./props";

export const FileListItem: FC<IFileListItemProps> = ({
  errors,
  file,
  onRemove,
}) => {
  let fileName: ReactNode;

  if (errors.mFileErrors.has(file.name)) {
    fileName = (
      <Tooltip title={errors.mFileErrors.get(file.name)} defaultOpen={true}>
        <span className="has-error">{file.name}</span>
      </Tooltip>
    );
  } else {
    fileName = <span>{file.name}</span>;
  }

  return (
    <li className="file-list-item">
      {fileName}
      <span>
        <Button type="text" onClick={() => onRemove()}>
          X
        </Button>
      </span>
    </li>
  );
};
