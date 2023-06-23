import { collection, getDocs } from "firebase/firestore/lite";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import { db } from "../firebase.mjs";
import { deleteCommand, fetchForms } from "./api.mjs";
import { startCommand } from "./start.mjs";

yargs(hideBin(process.argv))
  .command("fetch", "fetch forms", {}, fetchForms)
  .command("count", "count", {}, () => console.log(getSubmissions().length))
  .command("start", "start", {}, startCommand)
  .command("delete", "Delete from netlify", {}, deleteCommand)
  .command("firebase", "firebase", {}, async () => {
    const ref = collection(db, "linkSubmissions");
    const submissions = await getDocs(ref);
    submissions.forEach((doc) => {
      console.log(doc.id, doc.data());
    });
  })
  .demandCommand()
  .help().argv;
