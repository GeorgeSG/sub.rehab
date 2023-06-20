import { confirm } from "@inquirer/prompts";
import chalk from "chalk";
import { appendFileSync, readFileSync } from "fs";
import { readExistingData, writeData } from "../data.mjs";
import { error, success, warning } from "../output-utils.mjs";
import { subSchema, validateSubList } from "../validation.mjs";

const writeForDeletion = (submissionId) => {
  appendFileSync(new URL("./toDelete", import.meta.url), `${submissionId}\n`);
};

const writeForSkipping = (submissionId) => {
  appendFileSync(new URL("./toSkip", import.meta.url), `${submissionId}\n`);
};

const shouldSkip = (submissionId) => {
  const skipIds = readFileSync(new URL("./toSkip", import.meta.url), "utf8").split("\n");
  return skipIds.includes(submissionId);
};

export const startCommand = async () => {
  const knownServices = ["discord", "lemmy", "kbin", "matrix", "misc"];
  const currentSubmissions = JSON.parse(readFileSync(new URL("./forms.json", import.meta.url)));

  const suggestions = currentSubmissions.map(({ id, data }) => ({ id, data }));
  const count = suggestions.length;
  let i = 1;

  for await (const suggestion of suggestions) {
    console.log(chalk.bold.cyan(`${i} of ${count}`));
    i++;
    const existingData = readExistingData();

    if (shouldSkip(suggestion.id)) {
      warning("In skip list, skipping");
      continue;
    }

    let {
      subreddit: subredditName,
      service,
      link,
      official,
      officialExplanation,
    } = suggestion.data;

    subredditName = subredditName.trim();
    if (subredditName.startsWith("/r/")) {
      subredditName = subredditName.slice(1);
    }

    link = link.trim();
    if (!link.startsWith("https://")) {
      link = `https://${link}`;
    }
    service = service.trim();

    console.log("---");
    console.log(chalk.bold("Subreddit: "), `https://old.reddit.com/${subredditName}`);
    console.log(chalk.bold("Service:"), service);

    if (!knownServices.includes(service)) {
      error(`!!! Unknown service ${service} !!!`, false);
    }

    console.log(chalk.bold("Link:"), link);
    console.log(chalk.bold("Official:"), official);
    if (official === "true") {
      console.log(chalk.bold("Explanation:"), officialExplanation);
    }

    const shouldAdd = await confirm({ message: "Add?" });
    if (!shouldAdd) {
      const shouldDiscard = await confirm({ message: "Discard?" });
      if (shouldDiscard) {
        writeForDeletion(suggestion.id);
      } else {
        warning(`skipping ${subredditName}\n`);
        writeForSkipping(suggestion.id);
      }

      continue;
    }

    let isOfficial = false;
    if (official === "true") {
      const markOfficial = await confirm({ message: "Confirm official?" });
      isOfficial = markOfficial;
    }

    const newLink = {
      service,
      url: link,
      official: isOfficial,
      added_ts: new Date().getTime(),
    };

    let subredditToWrite = existingData.subs.find(
      (sub) => sub.name.toLowerCase() === subredditName.toLowerCase()
    );

    if (subredditToWrite) {
      warning(`Subreddit ${subredditName} already exists`);
      if (subredditToWrite.links.find((l) => l.url.toLowerCase() === link.toLowerCase())) {
        warning("Link already exists, skipping...");
        writeForDeletion(suggestion.id);

        continue;
      }

      console.log("Existing links:", subredditToWrite.links);
      const shouldAddLink = await confirm({ message: "Add new link?" });

      if (!shouldAddLink) {
        continue;
      } else {
        subredditToWrite = {
          ...subredditToWrite,
          links: [...subredditToWrite.links, newLink],
        };
      }
    } else {
      subredditToWrite = { name: subredditName, links: [newLink] };
    }

    const subValid = subSchema.safeParse(subredditToWrite);
    if (!subValid.success) {
      console.log(subValid.error.issues);
      error("Invalid subreddit", false);
    } else {
      success("Subreddit schema valid");
      console.log(chalk.bold("New subreddit"), subredditToWrite);
    }

    const newData = {
      subs: [
        ...existingData.subs.filter((sub) => sub.name !== subredditToWrite.name),
        subredditToWrite,
      ],
    };
    validateSubList(newData.subs);

    writeData(newData);
    writeForDeletion(suggestion.id);
    success(`${subredditName} added. Deleting submission...`);
    console.log("\n\n");
  }
};
