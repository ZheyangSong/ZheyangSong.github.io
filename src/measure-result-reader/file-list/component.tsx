import React, { FC } from "react";
import { FileListItem } from "./list-item";
import { IFileListProps } from "./props";

export const FileList: FC<IFileListProps> = ({
  files,
  errors,
  onRemove = () => {},
}) => {
  return (
    <ul className="file-list">
      {files.map((file, idx) => (
        <FileListItem
          key={file.name}
          file={file}
          onRemove={() => onRemove(idx)}
          errors={errors}
        />
      ))}
    </ul>
  );
};
