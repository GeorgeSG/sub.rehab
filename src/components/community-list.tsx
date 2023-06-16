import data from "@/subreddits";
import {
  Checkbox,
  MultiSelect,
  Paper,
  SimpleGrid,
  Text,
  TextInput,
  Title,
  Tooltip,
  createStyles,
} from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import {
  IoCheckmarkCircleOutline,
  IoCloseOutline,
  IoGlobeOutline,
  IoSearch,
} from "react-icons/io5";
import { Community } from "./community";
import { Section } from "./section";

const useStyles = createStyles((theme) => ({
  filters: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.lg,
    marginTop: theme.spacing.lg,

    [theme.fn.smallerThan("md")]: {
      marginTop: theme.spacing.md,
      flexDirection: "column",
      alignItems: "flex-start",
      gap: theme.spacing.xxs,
    },
  },

  checkboxList: {
    flexShrink: 0,

    [theme.fn.smallerThan("md")]: {
      width: "100%",
    },
  },

  searchInput: {
    [theme.fn.smallerThan("md")]: {
      width: "100%",
    },
  },

  checkbox: {
    alignItems: "center",
  },

  officialOnly: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
  },
}));

const ALL_SERVICES = Array.from(
  new Set(data.subs.flatMap((sub) => sub.links.map((link) => link.service)))
);

export function CommunityList() {
  const { classes } = useStyles();
  const [searchParam, setSearchParam] = useState("");
  const [visibleServices, setVisibleServices] = useState<string[]>(ALL_SERVICES);
  const [officialOnly, setOfficialOnly] = useState(false);

  const isLinkVisible = useCallback(
    (link: any) => visibleServices.includes(link.service) && (!officialOnly || link.official),
    [visibleServices, officialOnly]
  );

  const visibleSubs = useMemo(
    () =>
      data.subs
        .filter(
          (sub) =>
            sub.name.toLowerCase().includes(searchParam.toLowerCase()) &&
            sub.links.some(isLinkVisible)
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    [searchParam, isLinkVisible]
  );

  return (
    <>
      <Section mt="xxl">
        <Title order={2} sx={{ fontFamily: "var(--font-accent)" }}>
          Communities
        </Title>
        <div className={classes.filters}>
          <TextInput
            placeholder="Search"
            value={searchParam}
            size="md"
            onChange={(e) => setSearchParam(e.currentTarget.value)}
            icon={<IoSearch />}
            rightSection={<IoCloseOutline onClick={() => setSearchParam("")} />}
            className={classes.searchInput}
          />
          <MultiSelect
            clearable
            icon={<IoGlobeOutline />}
            className={classes.checkboxList}
            placeholder="Select services"
            size="md"
            data={ALL_SERVICES}
            value={visibleServices}
            onChange={setVisibleServices}
            withinPortal
          />
          <Checkbox
            classNames={{ body: classes.checkbox }}
            style={{ flexShrink: 0, alignItems: "center" }}
            label={
              <Tooltip label="Links that have been posted in the original subreddit" withArrow>
                <Text className={classes.officialOnly}>
                  Official only
                  <IoCheckmarkCircleOutline size="1rem" />
                </Text>
              </Tooltip>
            }
            checked={officialOnly}
            onChange={(e) => setOfficialOnly(e.target.checked)}
          />
        </div>

        {visibleSubs.length === 0 && (
          <Paper mt="xxl" px="xxs" style={{ background: "transparent" }}>
            {searchParam ? (
              <>
                No results matching <strong>&quot;{searchParam}&quot;</strong> found.
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
