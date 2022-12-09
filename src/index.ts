import { Directory, getDirectorySize } from "./directories.js";
import { getLineReader } from "./reader.js";

const args = process.argv.slice(2);
const filePath = args[0] || "test/fixtures/input.txt";
const lineReader = getLineReader({
  filePath,
});

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
  const MAX_SIZE = 100000;
  const total = Array.from(directories.values())
    .map((directory) => getDirectorySize(directory, directories))
    .filter((size) => size <= MAX_SIZE)
    .reduce((acc, size) => (acc += size), 0);

  console.log(`Total size of directories less than ${MAX_SIZE} is ${total}`);
});
