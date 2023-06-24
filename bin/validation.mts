import chalk from "chalk";
import z from "zod";
import { error, log, warning } from "./output-utils.mjs";

const findDuplicates = (arr: any[]) => {
  let sorted_arr = arr.slice().sort(); // You can define the comparing function here.
  // JS by default uses a crappy string compare.
  // (we use slice to clone the array so the
  // original array won't be modified)
  let results = [];
  for (let i = 0; i < sorted_arr.length - 1; i++) {
    if (sorted_arr[i + 1] == sorted_arr[i]) {
      results.push(sorted_arr[i]);
    }
  }
  return results;
};

export const linkSchema = z.object({
  service: z.string().min(1),
  url: z.string().startsWith("https://").url(),
  official: z.boolean().optional(),
  added_ts: z.number().optional(),
});

export const subSchema = z.object({
  name: z.string().startsWith("r/").min(3),
  links: z.array(linkSchema).nonempty(),
});

export const subListSchema = z.array(subSchema).nonempty();

export function validateSubList(subList: any[]) {
  log("Validating sub list...");
  const zodValidation = subListSchema.safeParse(subList);

  // Validate Zod schema
  if (!zodValidation.success) {
    const errors = zodValidation.error.issues;

    error("Found problems in the definitions of the following subs:", false);
    errors.forEach((subError: any) => {
      const sub = subList[subError.path[0]];
      log(chalk.yellow.bold(`SUB: ${sub.name}`));
      console.log(sub);
      error("errors:", false);
      Object.keys(subError).forEach((key) => {
        console.log(`${key}: ${chalk.red.bold(JSON.stringify(subError[key]))}`);
      });
      console.log();
    });

    process.exit(1);
  }

  // Validate link uniqueness
  const allLinks = subList.flatMap((sub) => sub.links).map((link) => link.url);
  const duplicateLinks = findDuplicates(allLinks);
  if (duplicateLinks.length > 0) {
    warning("Duplicate links found!");
    console.log(duplicateLinks);
  }

  // Validate name uniqueness
  const allNames = subList.map((sub) => sub.name.toLowerCase());
  if (allNames.find((name) => name.startsWith("/") || name.endsWith("/"))) {
    error(`${name}: Subreddit names should not start or end with a slash`);
  }

  const duplicateSubs = findDuplicates(allNames);
  if (duplicateSubs.length > 0) {
    console.log(duplicateSubs);
    error("Duplicate keys found!");
  }

  return true;
}
