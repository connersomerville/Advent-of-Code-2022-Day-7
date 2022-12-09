import fs from "fs";
import path from "path";
import readline from "readline";

type GetLineReader = {
  filePath: string;
};
export const getLineReader = ({ filePath }: GetLineReader) => {
  const inputStream = fs.createReadStream(path.resolve(filePath));

  return readline.createInterface({
    input: inputStream,
    terminal: false,
  });
};
