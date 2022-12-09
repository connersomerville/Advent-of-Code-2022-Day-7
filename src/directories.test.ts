import { describe, it, expect } from "vitest";
import {
  closestDirectorySize,
  Directory,
  getDirectorySize,
} from "./directories.js";

const root = { name: "/", size: 1, subDirs: ["/a"] };
const a = { name: "/a", size: 2, subDirs: ["/a/b", "/a/c"] };
const b = { name: "/a/b", size: 3, subDirs: [] };
const c = { name: "/a/c", size: 4, subDirs: ["/a/c/d"] };
const d = { name: "/a/c/d", size: 5, subDirs: [] };
const directoryIndex = new Map<string, Directory>([
  ["/", root],
  ["/a", a],
  ["/a/b", b],
  ["/a/c", c],
  ["/a/c/d", d],
]);

describe("Directories", () => {
  describe("Get Size", () => {
    it("deliberately double counts sizes", () => {
      expect(getDirectorySize(root, directoryIndex)).toEqual(15);
      expect(getDirectorySize(a, directoryIndex)).toEqual(14);
      expect(getDirectorySize(b, directoryIndex)).toEqual(3);
      expect(getDirectorySize(c, directoryIndex)).toEqual(9);
      expect(getDirectorySize(d, directoryIndex)).toEqual(5);
    });
  });
  describe("Get Closest Directory Size", () => {
    it("finds directory with smallest distance to target", () => {
      expect(
        closestDirectorySize([root, a, b, c, d], directoryIndex, 1)
      ).toEqual(b);
      expect(
        closestDirectorySize([root, a, b, c, d], directoryIndex, 4)
      ).toEqual(d);
      expect(
        closestDirectorySize([root, a, b, c, d], directoryIndex, 10)
      ).toEqual(a);
      expect(
        closestDirectorySize([root, a, b, c, d], directoryIndex, 15)
      ).toEqual(root);
    });
  });
});
