import { readFileSync } from "fs";
import { writeToAWS } from "../lib/s3.mts";

const data = readFileSync(new URL("../../data/discord-stats.json", import.meta.url)).toString();

console.log(data);

writeToAWS("discord-stats.json", data);
