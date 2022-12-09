export type Directory = {
  name: string;
  size: number;
  subDirs: string[];
};

const memo = new Map<string, number>();
export const getDirectorySize = (
  dir: Directory,
  directoryIndex: Map<string, Directory>
) => {
  const memoisedSize = memo.get(dir.name);
  if (memoisedSize) {
    return memoisedSize;
  }

  let size = dir.size;
  for (const subDir of dir.subDirs) {
    const subDirDefinition = directoryIndex.get(subDir);
    if (subDirDefinition) {
      const subDirSize = getDirectorySize(subDirDefinition, directoryIndex);

      size += subDirSize;
    }
  }

  memo.set(dir.name, size);

  return size;
};

export const closestDirectorySize = (
  dirs: Directory[],
  directoryIndex: Map<string, Directory>,
  targetSize: number
) => {
  let closest: Directory | undefined;
  let closestDistance: number | undefined;

  dirs.forEach((dir) => {
    const distance = getDirectorySize(dir, directoryIndex) - targetSize;
    const isBigEnough = distance >= 0;

    if (isBigEnough && (!closestDistance || distance < closestDistance)) {
      closest = dir;
      closestDistance = distance;
    }
  });

  if (closest == null) {
    throw new Error("no suitable directories");
  }
  return {
    dir: closest,
    totalSize: getDirectorySize(closest, directoryIndex),
  };
};
