import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import { deleteCommand, fetchForms } from "./api.mjs";
import { startCommand } from "./start.mjs";

yargs(hideBin(process.argv))
  .command("fetch", "fetch forms", {}, fetchForms)
  .command("count", "count", {}, () => console.log(getSubmissions().length))
  .command("start", "start", {}, startCommand)
  .command("delete", "Delete from netlify", {}, deleteCommand)
  .demandCommand()
  .help().argv;
