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
