import { useFavorites } from "@/hooks/use-favorites";
import { useFilteredSubreddits } from "@/hooks/use-filtered-subreddits";
import { Subreddit } from "@/types";
import { Box, SimpleGrid, Title } from "@mantine/core";
import Link from "next/link";
import { groupBy } from "ramda";
import { Fragment, useMemo } from "react";
import { CommunityFavorite } from "../communities/community-favorite";
import { LinkPill } from "../core/link-pill";
import { Filter } from "../communities/community-filters";

export function SubredditsView({ filter }: { filter: Filter }) {
  const { visibleSubreddits } = useFilteredSubreddits(90);
  const [favorites] = useFavorites();

  const favoritedSubs = useMemo(
    () => visibleSubreddits.filter((sub) => favorites.includes(sub.name)),
    [favorites, visibleSubreddits]
  );

  const grouped = useMemo<Record<string, Subreddit[]>>(() => {
    const unfavorited = visibleSubreddits.filter((sub) => !favorites.includes(sub.name));

    if (filter.sortBy === "name") {
      return groupBy((sub) => sub.name.charAt(2).toLowerCase(), unfavorited);
    } else {
      return { [`Subreddits by highest community ${filter.sortBy}`]: unfavorited };
    }
  }, [visibleSubreddits, favorites, filter]);

  return (
    <>
      {favoritedSubs.length > 0 && (
        <>
          <Title order={4} mt="xxl" sx={{ fontFamily: "var(--font-accent)" }}>
            Favorited
          </Title>
          <SimpleGrid
            cols={3}
            spacing="lg"
            mt="xs"
            breakpoints={[
              { maxWidth: "lg", cols: 2, spacing: "lg" },
              { maxWidth: "sm", cols: 1, spacing: "sm" },
              { maxWidth: "xs", cols: 1, spacing: "xs" },
            ]}
          >
            {favoritedSubs.map((sub: Subreddit) => (
              <LinkPill key={sub.name} component={Link} href={`/${sub.name.toLowerCase()}`}>
                {sub.name}
                <Box ml="auto">
                  <CommunityFavorite name={sub.name} />
                </Box>
              </LinkPill>
            ))}
          </SimpleGrid>
        </>
      )}

      {Object.keys(grouped).map((key: string) => (
        <Fragment key={key}>
          <Title order={4} mt="xxl" sx={{ fontFamily: "var(--font-accent)" }}>
            {key}
          </Title>
          <SimpleGrid
            cols={3}
            spacing="lg"
            mt="xs"
            breakpoints={[
              { maxWidth: "lg", cols: 2, spacing: "lg" },
              { maxWidth: "sm", cols: 1, spacing: "sm" },
              { maxWidth: "xs", cols: 1, spacing: "xs" },
            ]}
          >
            {grouped[key].map((sub: Subreddit) => (
              <LinkPill key={sub.name} component={Link} href={`/${sub.name.toLowerCase()}`}>
                {sub.name}
                <Box ml="auto">
                  <CommunityFavorite name={sub.name} />
                </Box>
              </LinkPill>
            ))}
          </SimpleGrid>
        </Fragment>
      ))}
    </>
  );
}
