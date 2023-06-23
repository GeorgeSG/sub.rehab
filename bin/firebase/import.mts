import chalk from "chalk";
import { appendFileSync, readFileSync, writeFileSync } from "fs";
import prettier from "prettier";
import { normalizeLink, normalizeSubreddit } from "../normalizers.mts";
import { error, success, warning } from "../output-utils.mts";
import { subSchema, validateSubList } from "../validation.mts";

const subredditsUrl = new URL("../../data/subreddits.json", import.meta.url);
const importUrl = new URL("../../import/import.json", import.meta.url);

type ExistingLink = {
  service: string;
  url: string;
  official?: boolean;
  added_ts?: number;
};

type ExiistingData = {
  subs: ExistingSub[];
};

type ExistingSub = {
  name: string;
  links: ExistingLink[];
};

type ImportSub = {
  id: string;
  added_ts: number;
  subreddit: string;
  service: string;
  url: string;
  official?: boolean;
  added_by?: string;
};

const getExistingData = () =>
  JSON.parse(readFileSync(subredditsUrl).toString()).subs as ExistingSub[];

const writeForDeletion = (id: string) => {
  appendFileSync(new URL("./toDelete", import.meta.url), `${id}\n`);
};

export const writeData = (newData: ExiistingData) =>
  writeFileSync(
    subredditsUrl,
    prettier.format(JSON.stringify(newData), { printWidth: 100, parser: "json" })
  );

const addLink = (importSub: ImportSub) => {
  let existingData = getExistingData();
  const importName = normalizeSubreddit(importSub.subreddit);
  const url = normalizeLink(importSub.url);

  let subredditToWrite = existingData.find(
    (sub: ExistingSub) => sub.name.toLowerCase() === importName.toLowerCase()
  );

  const newLink: ExistingLink = {
    service: importSub.service,
    url,
    official: importSub.official,
    added_ts: new Date().getTime(),
  };

  if (subredditToWrite) {
    warning(`Subreddit ${importName} already exists`);
    if (
      subredditToWrite.links.find((l: ExistingLink) => l.url.toLowerCase() === url.toLowerCase())
    ) {
      warning("Link already exists, skipping...");
      writeForDeletion(importSub.id);
      return;
    }

    subredditToWrite = {
      ...subredditToWrite,
      links: [...subredditToWrite.links, newLink],
    };
  } else {
    subredditToWrite = { name: importName, links: [newLink] };
  }

  const subValid = subSchema.safeParse(subredditToWrite);
  if (!subValid.success) {
    console.log(subValid.error.issues);
    error("Invalid subreddit", false);
  }

  const newData = {
    subs: [
      ...existingData.filter((sub: ExistingSub) => sub.name !== subredditToWrite!.name),
      subredditToWrite,
    ],
  };

  writeData(newData);

  writeForDeletion(importSub.id);
};

export const onImport = () => {
  const importData = JSON.parse(readFileSync(importUrl).toString());
  console.log("TO IMPORT: ", importData.length);

  importData.forEach((sub: ImportSub) => {
    addLink(sub);
  });

  const existingData = getExistingData();
  validateSubList(existingData);
};
