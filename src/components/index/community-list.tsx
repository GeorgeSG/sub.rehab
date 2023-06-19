import { Section } from "@/components/core/section";
import { useSubredditData } from "@/data";
import { useIsLinkNew } from "@/hooks/use-is-link-new";
import data from "@/subreddits";
import { Paper, SimpleGrid, Title } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Community } from "./community";
import { CommunityFilters, Filter } from "./community-filters";

export function CommunityList() {
  const { uniqueServiceList } = useSubredditData();
  const isLinkNew = useIsLinkNew();

  const [filter, setFilter] = useSetState<Filter>({
    searchParam: "",
    visibleServices: uniqueServiceList,
    officialOnly: false,
    newOnly: false,
  });

  const isLinkVisible = useCallback(
    (link: any) =>
      filter.visibleServices.includes(link.service) &&
      (!filter.officialOnly || link.official) &&
      (!filter.newOnly || isLinkNew(link.added_ts)),
    [filter, isLinkNew]
  );

  const filteredSubs = useMemo(
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

  const [page, setPage] = useState(1);

  const visibleSubs = useMemo(() => filteredSubs.slice(0, page * 20), [filteredSubs, page]);

  useEffect(() => {
    // Refresh page when filter changes
    setPage(1);
  }, [filter]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + Math.round(window.scrollY) + window.innerHeight / 5 >=
      document.body.offsetHeight
    ) {
      setPage((prev) => prev + 1);
    }
  };

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
