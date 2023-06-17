import data from "@/subreddits";
import { Paper, SimpleGrid, Table, Title } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { Community } from "./community";
import { CommunityFilters, Filter } from "./community-filters";
import { Section } from "./section";
import { useSubredditData } from "@/data";

export function CommunityList() {
  const { uniqueServiceList } = useSubredditData();
  const [filter, setFilter] = useState<Filter>({
    searchParam: "",
    visibleServices: uniqueServiceList,
    officialOnly: false,
  });

  const isLinkVisible = useCallback(
    (link: any) =>
      filter.visibleServices.includes(link.service) && (!filter.officialOnly || link.official),
    [filter]
  );

  const visibleSubs = useMemo(
    () =>
      data.subs
        .filter(
          (sub) =>
            sub.name.toLowerCase().includes(filter.searchParam.toLowerCase()) &&
            sub.links.some(isLinkVisible)
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    [filter, isLinkVisible]
  );

  return (
    <>
      <Section mt="xxl">
        <Title order={2} sx={{ fontFamily: "var(--font-accent)" }}>
          Communities
        </Title>
        <CommunityFilters {...{ filter, setFilter }} />

        {visibleSubs.length === 0 && (
          <Paper mt="xxl" px="xxs" style={{ background: "transparent" }}>
            {filter.searchParam ? (
              <>
                No results matching <strong>&quot;{filter.searchParam}&quot;</strong> found.
              </>
            ) : (
              <>No results found.</>
            )}
          </Paper>
        )}

        <SimpleGrid
          cols={3}
          spacing="lg"
          mt="xxl"
          breakpoints={[
            { maxWidth: "md", cols: 2, spacing: "md" },
            { maxWidth: "xs", cols: 1, spacing: "sm" },
          ]}
        >
          {visibleSubs.map(({ name, links }) => (
            <Community key={name} name={name} links={links.filter(isLinkVisible)} />
          ))}
        </SimpleGrid>
      </Section>
    </>
  );
}
