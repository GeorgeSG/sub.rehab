import lemmyStats from "@/lemmyStats";
import discordStats from "@/discordStats";
import data from "@/subreddits";
import { MantineTheme } from "@mantine/core";
import { useMemo } from "react";
import { Link, Subreddit } from "./types";

export const SERVICE_COLORS: Record<string, (theme: MantineTheme) => string> = {
  lemmy: ({ colors, colorScheme }) => (colorScheme === "dark" ? colors.gray[7] : colors.gray[2]),
  discord: () => "#7289DA",
  matrix: () => "black",
  kbin: () => "#D57AD4",
  misc: ({ colors }) => colors.orange[5],
  squabbles: () => "#2581BC",
  raddle: () => "#EA3524",
};

type LemmyStatKey = keyof typeof lemmyStats;
type DiscordStatKey = keyof typeof discordStats;

export function getSubreddits(): Subreddit[] {
  return data.subs.map((sub) => {
    return {
      ...sub,
      links: sub.links.map((link) => {
        if (link.service === "lemmy" && lemmyStats[link.url as LemmyStatKey]) {
          return { ...link, stats: lemmyStats[link.url as LemmyStatKey] };
        }
        if (link.service === "discord") {
          const statKey = link.url.split("discord.gg/")?.[1] as DiscordStatKey;

          if (statKey && discordStats[statKey]) {
            return { ...link, stats: discordStats[statKey] };
          }

          // attempt with lowercase key
          if (statKey && discordStats[statKey.toLowerCase() as DiscordStatKey]) {
            return { ...link, stats: discordStats[statKey.toLowerCase() as DiscordStatKey] };
          }
        }
        return link;
      }),
    };
  });
}

export function getSubredditData(subredditName: string): Subreddit | undefined {
  const normalizedSubreddit = subredditName.toLowerCase();
  return getSubreddits().find((sub) => sub.name.toLowerCase() === normalizedSubreddit);
}

export function getAllSubredditNames(): string[] {
  return getSubreddits().map((sub) => sub.name);
}

export function useSubredditData() {
  const allLinks: Link[] = useMemo(() => getSubreddits().flatMap((sub) => sub.links), []);

  const uniqueServiceList = useMemo(
    () => Array.from(new Set(allLinks.map((link) => link.service))),
    [allLinks]
  );

  const communitiesCount = useMemo(() => Object.keys(getSubreddits()).length, []);

  const linksCount = useMemo(
    () => getSubreddits().reduce((acc, sub) => acc + sub.links.length, 0),
    []
  );

  const officialLinksCount = useMemo(
    () =>
      getSubreddits().reduce(
        (acc, sub) => acc + sub.links.filter(({ official }) => official).length,
        0
      ),
    []
  );

  const countPerService = useMemo(
    () =>
      allLinks.reduce<Record<string, number>>((acc, link) => {
        acc[link.service] = (acc[link.service] || 0) + 1;
        return acc;
      }, {}),
    [allLinks]
  );

  return {
    uniqueServiceList,
    communitiesCount,
    linksCount,
    officialLinksCount,
    countPerService,
    allLinks,
  };
}
