import z from "zod";
import { error, log } from "./output-utils.mjs";
import chalk from "chalk";

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

export function validateSubList(subList) {
  log("Validating sub list...");
  const zodValidation = subListSchema.safeParse(subList);

  // Check Zod
  if (!zodValidation.success) {
    const errors = zodValidation.error.issues;

    error("Found problems in the definitions of the following subs:", false);
    errors.forEach((subError) => {
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

  // Check name uniqueness
  const allNames = subList.map((sub) => sub.name.toLowerCase());
  if (allNames.find((name) => name.startsWith("/"))) {
    error(`${name}: Subreddit names should not start with a slash`);
  }

  const uniqNames = Array.from(new Set(allNames));
  if (allNames.length !== uniqNames.length) {
    const findDuplicates = (arr) => {
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
    const duplicates = findDuplicates(allNames);
    console.log(duplicates);
    error("Duplicate keys found!");
  }

  return true;
}
