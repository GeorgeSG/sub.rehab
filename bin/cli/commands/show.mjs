import { data } from "../../data.mjs";
import { warning, success } from "../../output-utils.mjs";
import { input } from "@inquirer/prompts";

export async function showSubreddit(argv) {
  const name = argv.name || (await input({ message: "Subreddit name:" }));

  const sub = data.subs.find((sub) => sub.name.toLowerCase() === name.toLowerCase());
  if (!sub) {
    warning(`Subreddit ${name} not found!`);
  } else {
    success(`Subreddit ${name} found.`);
    console.log(sub);
  }
}
