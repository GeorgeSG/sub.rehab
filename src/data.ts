import data from "@/subreddits";
import { MantineTheme } from "@mantine/core";
import { useMemo } from "react";

export const SERVICE_COLORS: Record<string, (theme: MantineTheme) => string> = {
  lemmy: ({ colors, colorScheme }) => (colorScheme === "dark" ? colors.gray[7] : colors.gray[2]),
  discord: () => "#7289DA",
  matrix: () => "black",
  kbin: () => "#D57AD4",
  misc: ({ colors }) => colors.orange[5],
  squabbles: () => "#2581BC",
  raddle: () => "#4FA736",
};

export function useSubredditData() {
  const allLinks = useMemo(() => data.subs.flatMap((sub) => sub.links), []);

  const uniqueServiceList = useMemo(
    () => Array.from(new Set(allLinks.map((link) => link.service))),
    [allLinks]
  );

  const communitiesCount = useMemo(() => Object.keys(data.subs).length, []);
  const linksCount = useMemo(() => data.subs.reduce((acc, sub) => acc + sub.links.length, 0), []);
  const officialLinksCount = useMemo(
    () =>
      data.subs.reduce((acc, sub) => acc + sub.links.filter(({ official }) => official).length, 0),
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
