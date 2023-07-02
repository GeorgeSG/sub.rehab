import { confirm, input, select } from "@inquirer/prompts";
import chalk from "chalk";
import { data, readExistingData, writeData } from "../../data.mjs";
import { chalkSuccess, error, success, warning } from "../../output-utils.mts";
import { subSchema, validateSubList } from "../../validation.mts";

const knownServices = ["discord", "lemmy", "kbin", "matrix", "squabbles", "raddle"];

const createLink = async () => {
  let url = await input({ message: "Link URL:" });
  url = url.trim();

  if (!url.startsWith("https://")) {
    url = `https://${url}`;
  }

  let service;

  for await (const knownService of knownServices) {
    if (url.includes(knownService)) {
      const doesLinkMatch = await confirm({ message: `Is this a ${knownService} link?` });
      if (doesLinkMatch) {
        service = knownService;
        break;
      }
    }
  }

  if (!service) {
    service = await select({
      message: "Link service:",
      choices: [
        ...knownServices.map((service) => ({ name: service, value: service })),
        { name: "misc", value: "misc" },
      ],
    });
  }

  const official = await confirm({ message: "Is this an official link?" });

  return { service, url, official, added_ts: new Date().getTime() };
};

export async function addSubreddit(argv: any) {
  let name = argv.name || (await input({ message: "Subreddit name:" }));
  name = name.trim();
  if (name.startsWith("/r/")) {
    name = name.slice(1);
  }
  if (!name.startsWith("r/")) {
    name = `r/${name}`;
  }

  let subreddit = readExistingData().subs.find(
    (sub: any) => sub.name.toLowerCase() === name.toLowerCase()
  );
  let newLink;

  if (subreddit) {
    warning(`Subreddit ${name} already exists`);
    console.log("Existing links:", subreddit.links);
    const shouldAddLink = await confirm({ message: "Add new link?" });

    if (!shouldAddLink) {
      process.exit(0);
    }
  } else {
    subreddit = { name, links: [] };
  }

  newLink = await createLink();

  subreddit = { ...subreddit, links: [...subreddit.links, newLink] };

  const subValid = subSchema.safeParse(subreddit);
  if (!subValid.success) {
    console.log(subValid.error.issues);
    error("Invalid subreddit");
  } else {
    success("Subreddit is valid");
    console.log(chalk.bold("New subreddit"), subreddit);
  }

  const newData = {
    subs: [...data.subs.filter((sub: any) => sub.name !== subreddit.name), subreddit],
  };
  validateSubList(newData.subs);

  await writeData(newData);
  console.log(chalkSuccess("All good!"));

  if (!argv.name) {
    addSubreddit(argv);
  }
}
