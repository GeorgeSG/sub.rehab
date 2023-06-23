import { readFileSync } from "fs";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import { chalkSuccess } from "../output-utils.mts";
import { validateSubList } from "../validation.mts";
import { onImport } from "./import.mjs";

const onValidate = () => {
  const subredditsUrl = new URL("../../data/subreddits.json", import.meta.url);
  const data = JSON.parse(readFileSync(subredditsUrl).toString());

  validateSubList(data.subs);
  console.log(chalkSuccess("All good!"));
};

yargs(hideBin(process.argv))
  .command("import", "import from file", {}, onImport)
  .command("validate", "Check for errors", {}, onValidate)
  .demandCommand()
  .help().argv;
