import data from "@/subreddits";
import { Checkbox, Paper, Text, TextInput, Title, createStyles } from "@mantine/core";
import { useMemo, useState } from "react";
import { IoCloseOutline, IoSearch } from "react-icons/io5";
import { Section } from "./section";
import { Community } from "./community";

const useStyles = createStyles((theme) => ({
  communityList: {
    marginTop: theme.spacing.xxl,
    display: "grid",

    gap: theme.spacing.lg,
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",

    [theme.fn.smallerThan("md")]: {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },

    [theme.fn.smallerThan("xs")]: {
      gridTemplateColumns: "minmax(0, 1fr)",
      gap: theme.spacing.md,
    },
  },

  filters: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.lg,
    marginTop: theme.spacing.lg,

    [theme.fn.smallerThan("xs")]: {
      marginTop: theme.spacing.md,
      flexDirection: "column",
      alignItems: "flex-start",
      gap: theme.spacing.xxs,
    },
  },

  checkboxList: {
    display: "flex",
    gap: theme.spacing.lg,
    [theme.fn.smallerThan("xs")]: {
      marginTop: theme.spacing.xs,
    },
  },

  searchInput: {
    [theme.fn.smallerThan("xs")]: {
      width: "100%",
    },
  },

  checkbox: {
    alignItems: "center",
  },
}));

const ALL_SERVICES = Array.from(
  new Set(data.subs.flatMap((sub) => sub.links.map((link) => link.service)))
);

export function CommunityList() {
  const { classes } = useStyles();
  const [searchParam, setSearchParam] = useState("");
  const [visibleServices, setVisibleServices] = useState<string[]>(ALL_SERVICES);

  const visibleSubs = useMemo(
    () =>
      data.subs
        .filter(
          (sub) =>
            sub.name.toLowerCase().includes(searchParam.toLowerCase()) &&
            sub.links
              .map((link) => link.service)
              .some((service) => visibleServices.includes(service))
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    [searchParam, visibleServices]
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
          <div className={classes.checkboxList}>
            {ALL_SERVICES.map((service) => (
              <Checkbox
                classNames={{ body: classes.checkbox }}
                key={service}
                label={
                  <Text span size="md">
                    {service}
                  </Text>
                }
                checked={visibleServices.includes(service)}
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    setVisibleServices((prev) => [...prev, service]);
                  } else {
                    setVisibleServices((prev) => prev.filter((s) => s !== service));
                  }
                }}
              />
            ))}
          </div>
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
        <div className={classes.communityList}>
          {visibleSubs.map((sub) => (
            <Community key={sub.name} {...sub} />
          ))}
        </div>
      </Section>
    </>
  );
}
