import { Subreddit } from "@/types";
import { readFileSync } from "fs";

export function getCommunities(service: string): string[] {
  const subredditsUrl = new URL("../../data/subreddits.json", import.meta.url);

  const subs: Subreddit[] = JSON.parse(readFileSync(subredditsUrl, "utf-8").toString()).subs;
  return subs
    .flatMap((sub) => sub.links)
    .filter((link) => link.service === service)
    .map((link) => link.url);
}
