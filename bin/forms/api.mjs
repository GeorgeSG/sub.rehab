import dotenv from "dotenv";
import { readFileSync, writeFileSync } from "fs";
import fetch from "node-fetch";
import prettier from "prettier";

const config = dotenv.config().parsed;
const { NETLIFY_FORM, NETLIFY_TOKEN } = config;

const headers = {
  "User-Agent": "sub.rehab (georgi@gar.dev)",
  Authorization: `Bearer ${NETLIFY_TOKEN}`,
};

const deleteSubmission = (submission_id) => {
  fetch(`https://api.netlify.com/api/v1/submissions/${submission_id}`, {
    method: "DELETE",
    headers,
  })
    .then(() => console.log(`deleted ${submission_id}`))
    .catch((e) => console.error(`unable to delete ${submission_id}`, e));
};

export const deleteCommand = () => {
  const toDelete = readFileSync(new URL("./toDelete", import.meta.url), "utf8").split("\n");

  toDelete.forEach((submissionId) => {
    if (submissionId) {
      console.log(`deleting ${submissionId}`);
      deleteSubmission(submissionId);
    }
  });

  console.log(JSON.stringify(toDelete));
};

export const fetchForms = () => {
  fetch(`https://api.netlify.com/api/v1/forms/${NETLIFY_FORM}/submissions`, {
    method: "GET",
    headers,
  })
    .then(async (res) => {
      const body = await res.json();
      const fileData = prettier.format(JSON.stringify(body), { printWidth: 100, parser: "json" });
      writeFileSync(new URL("./forms.json", import.meta.url), fileData);
      writeFileSync(new URL(`./forms.${new Date().getTime()}.json`, import.meta.url), fileData);
    })
    .catch((err) => {
      console.log("unable to fetch from netlify api");
      console.error(err);
    });
};
