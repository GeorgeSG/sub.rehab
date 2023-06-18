import { select, confirm, input } from "@inquirer/prompts";
import { writeData, data } from "../data.mjs";
import { subSchema, validateSubList } from "../validation.mjs";
import { chalkSuccess, error, warning, success } from "../output-utils.mjs";
import chalk from "chalk";

const knownServices = ["discord", "lemmy", "kbin", "matrix"];

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
      choices: knownServices.map((service) => ({ name: service, value: service })),
    });
  }

  const official = await confirm({ message: "Is this an official link?" });

  return { service, url, official, added_ts: new Date().getTime() };
};

export async function addSubreddit(argv) {
  let name = argv.name || (await input({ message: "Subreddit name:" }));
  name = name.trim();
  if (name.startsWith("/r/")) {
    name = name.slice(1);
  }

  let subreddit = data.subs.find((sub) => sub.name.toLowerCase() === name.toLowerCase());
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

  const newData = { subs: [...data.subs.filter((sub) => sub.name !== name), subreddit] };
  validateSubList(newData.subs);

  await writeData(newData);
  console.log(chalkSuccess("All good!"));
}
