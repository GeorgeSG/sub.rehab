import { useMemo } from "react";
import data from "@/subreddits";
import { MantineThemeColors } from "@mantine/core";

export const SERVICE_COLORS: Record<string, (colors: MantineThemeColors) => string> = {
  lemmy: (colors) => colors.gray[2],
  discord: () => "#7289DA",
  matrix: () => "black",
  kbin: () => "#D57AD4",
  web: (colors) => colors.orange[5],
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

  return { uniqueServiceList, communitiesCount, linksCount, officialLinksCount, countPerService };
}
