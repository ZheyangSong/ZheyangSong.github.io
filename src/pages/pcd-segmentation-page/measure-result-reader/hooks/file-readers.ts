import { IMeasurement } from "../types";

export function createFileReader(
  contentType: "arraybuffer" | "binarystring" | "text" | "dataurl"
) {
  const fileReader = new FileReader();

  return (fd: File, cb?: (percentage: number) => void) => {
    type FileReaderEventHandler<K extends keyof FileReaderEventMap> =
      Parameters<typeof fileReader.addEventListener<K>>[1];
    let loadHandler: FileReaderEventHandler<"load">;
    let errorHandler: FileReaderEventHandler<"error">;
    let progressHandler: FileReaderEventHandler<"progress">;

    const clearHandlers = () => {
      fileReader.removeEventListener("load", loadHandler);
      fileReader.removeEventListener("error", errorHandler);
      fileReader.removeEventListener("progress", progressHandler);
    };

    return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
      loadHandler = () => {
        clearHandlers();
        resolve(fileReader.result);
      };

      errorHandler = () => {
        clearHandlers();
        reject(fd.name);
      };

      progressHandler = (evt) => {
        if (cb) {
          cb(evt.loaded / evt.total);
        }
      };

      fileReader.addEventListener("load", loadHandler);
      fileReader.addEventListener("error", errorHandler);
      fileReader.addEventListener("progress", progressHandler);

      switch (contentType) {
        case "arraybuffer": {
          fileReader.readAsArrayBuffer(fd);
          break;
        }
        case "binarystring": {
          fileReader.readAsBinaryString(fd);
          break;
        }
        case "dataurl": {
          fileReader.readAsDataURL(fd);
          break;
        }
        case "text":
        default:
          fileReader.readAsText(fd);
      }
    });
  };
}

const readTextFile = createFileReader("text");
export const readMeasurement: (
  file: File
) => Promise<Partial<IMeasurement>> = async (file: File) => {
  const content = (await readTextFile(file)) as string;

  try {
    const parsed = JSON.parse(content);
    return parsed;
  } catch {
    return {};
  }
};
