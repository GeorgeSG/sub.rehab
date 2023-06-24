import { readFileSync, writeFileSync } from "fs";
import prettier from "prettier";

const subredditsUrl = new URL("../data/subreddits.json", import.meta.url);

export const data = JSON.parse(readFileSync(subredditsUrl).toString());

export const readExistingData = () => JSON.parse(readFileSync(subredditsUrl).toString());

export const writeData = (newData: any) =>
  writeFileSync(
    subredditsUrl,
    prettier.format(JSON.stringify(newData), { printWidth: 100, parser: "json" })
  );
