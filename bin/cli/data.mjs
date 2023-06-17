import { readFile, writeFile } from "fs/promises";
import prettier from "prettier";

export const data = JSON.parse(
  await readFile(new URL("../../data/subreddits.json", import.meta.url))
);

export const writeData = (newData) =>
  writeFile(
    new URL("../../data/subreddits.json", import.meta.url),
    prettier.format(JSON.stringify(newData), { printWidth: 100, parser: "json" })
  );
