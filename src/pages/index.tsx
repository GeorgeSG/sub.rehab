import { CommunityFilters } from "@/components/communities/community-filters";
import { Section } from "@/components/core/section";
import { CommunitiesView } from "@/components/index/communities-view";
import { IndexHeader } from "@/components/index/index-header";
import { SubredditsView } from "@/components/index/subreddits-view";
import { ViewSwitcher } from "@/components/index/view-switcher";
import { useFilteredSubreddits } from "@/hooks/use-filtered-subreddits";
import { Flex, Paper, Title, createStyles } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

const useStyles = createStyles(({ fn }) => ({
  filterTitle: {
    fontFamily: "var(--font-accent)",
    [fn.smallerThan("xs")]: {
      display: "none",
    },
  },
}));

export default function Home() {
  const { classes } = useStyles();
  const { filter, setFilter, visibleSubreddits } = useFilteredSubreddits(1);
  const [view, setView] = useLocalStorage<"communities" | "subreddits">({
    key: "sub-rehab-index-view",
    defaultValue: "communities",
  });

  const onChangeView = (view: "communities" | "subreddits") => {
    setView(view);
    umami?.track("setIndexView", { view });
  };

  return (
    <>
      <IndexHeader />
      <Section mt="xxl">
        <Title order={2} className={classes.filterTitle}>
          Filters
        </Title>
        <CommunityFilters {...{ filter, setFilter }} />
        <Flex mt="xxl" align="center" justify="space-between">
          <Title order={2} sx={{ fontFamily: "var(--font-accent)" }}>
            {view === "communities" ? "Communities" : "Subreddits"}
          </Title>
          <ViewSwitcher view={view} onChange={onChangeView} />
        </Flex>

        {visibleSubreddits.length === 0 && (
          <Paper mt="xxl" px="xxs" style={{ background: "transparent" }}>
            {filter.searchTerm ? (
              <>
                No results matching <strong>&quot;{filter.searchTerm}&quot;</strong> found.
              </>
            ) : (
              <>No results found.</>
            )}
          </Paper>
        )}
        {view === "communities" ? <CommunitiesView /> : <SubredditsView />}
      </Section>
    </>
  );
}
