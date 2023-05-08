interface FileLike {
  name: string;
}

export interface IFileListProps {
  files: FileLike[];
  onRemove?: (index: number) => void;
  errors: {
    mFileErrors: Map<string, string>;
  };
}

export interface IFileListItemProps {
  file: IFileListProps["files"][0];
  onRemove: () => void;
  errors: IFileListProps["errors"];
}
