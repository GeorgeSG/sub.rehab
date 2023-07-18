import { writeFileSync } from "fs";
import { readFromS3 } from "../lib/s3.mts";

readFromS3("lemmy-stats.json").then((data) => {
  writeFileSync(new URL("../../data/lemmy-stats.json", import.meta.url), JSON.stringify(data));
});
