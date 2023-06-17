import { select, confirm, input } from "@inquirer/prompts";
import { writeData, data } from "../data.mjs";
import { subSchema, validateSubList } from "../validation.mjs";
import { chalkSuccess, error, warning, success } from "../output-utils.mjs";
import chalk from "chalk";

const createLink = async () => {
  const service = await select({
    message: "Link service:",
    choices: [
      { name: "discord", value: "discord" },
      { name: "lemmy", value: "lemmy" },
      { name: "kbin", value: "kbin" },
      { name: "matrix", value: "matrix" },
      { name: "misc", value: "misc" },
    ],
  });
  let url = await input({ message: "Link URL:" });

  if (!url.startsWith("https://")) {
    url = `https://${url}`;
  }

  const official = await confirm({ message: "Is this an official link?" });

  return { service, url, official };
};

export async function addSubreddit(argv) {
  const name = argv.name || (await input({ message: "Subreddit name:" }));

  let subreddit = data.subs.find((sub) => sub.name === name);
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
