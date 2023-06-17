import chalk from "chalk";

export const chalkError = chalk.red.bold;
export const chalkSuccess = chalk.green.bold;
export const chalkWarning = chalk.yellow.bold;

export const log = (str) => console.log(chalk.bold(`↳ ${str}`));
export const success = (str) => console.log(chalkSuccess(`✔ ${str}`));
export const warning = (str) => console.warn(chalkWarning(`‼ ${str}`));

export const error = (str, shouldExit = true) => {
  console.error(chalkError(`✘ ${str}`));
  if (shouldExit) {
    process.exit(1);
  }
};
