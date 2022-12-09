import {
  closestDirectorySize,
  Directory,
  getDirectorySize,
} from "./directories.js";
import { getLineReader } from "./reader.js";

const args = process.argv.slice(2);
const filePath = args[0] || "test/fixtures/input.txt";
const lineReader = getLineReader({
  filePath,
});

const FILESYSTEM_SIZE = 70000000;
const UPDATE_REQUIRED_SPACE = 30000000;
const directories = new Map<string, Directory>();
let currentDir = "";

lineReader.on("line", (line) => {
  if (line.startsWith("$")) {
    const action = line.split(/\$\s/).filter(Boolean)[0];

    if (action.startsWith("cd")) {
      const [_, dir] = action.split(/cd\s/);
      switch (dir) {
        case "/":
          currentDir = "/";
          break;
        case "..":
          const newDir = currentDir.slice(0, currentDir.lastIndexOf("/"));
          currentDir = newDir.length ? newDir : "/";
          break;
        default:
          currentDir = currentDir.concat(
            currentDir.endsWith("/") ? dir : `/${dir}`
          );
      }
    }

    return;
  }

  const { size = 0, subDirs = [] } = directories.get(currentDir) || {};

  if (line.startsWith("dir")) {
    return directories.set(currentDir, {
      name: currentDir,
      size,
      subDirs: [
        ...subDirs,
        `${currentDir}${currentDir === "/" ? "" : "/"}${line.split(" ")[1]}`,
      ],
    });
  }

  const newSize = size + Number(line.split(" ")[0]);

  directories.set(currentDir, {
    name: currentDir,
    size: newSize,
    subDirs,
  });
});

lineReader.on("close", () => {
  const root = directories.get("/");
  if (!root) {
    throw new Error("Failed to determine root directory");
  }
  const rootSize = getDirectorySize(root, directories);
  const unusedSpace = FILESYSTEM_SIZE - rootSize;
  const requiredSpace = UPDATE_REQUIRED_SPACE - unusedSpace;
  console.log(`Total size of root directory is ${rootSize}`);
  console.log(`Total unused space is ${unusedSpace}`);
  console.log(`Total required space for update is ${requiredSpace}`);

  const directoryToDelete = closestDirectorySize(
    Array.from(directories.values()),
    directories,
    requiredSpace
  );

  console.log(
    `To free up space, delete directory ${directoryToDelete.dir.name} with a total size of ${directoryToDelete.totalSize}`
  );
});
