import { writeFileSync } from "fs";
import { readFromS3 } from "../lib/s3.mts";

readFromS3("discord-stats.json").then((data) => {
  writeFileSync(new URL("../../data/discord-stats.json", import.meta.url), JSON.stringify(data));
});
