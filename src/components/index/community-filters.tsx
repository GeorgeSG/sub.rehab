import { useSubredditData } from "@/data";
import {
  Checkbox,
  Drawer,
  MediaQuery,
  MultiSelect,
  Text,
  TextInput,
  Tooltip,
  createStyles,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import {
  IoCheckmarkCircleOutline,
  IoCloseOutline,
  IoFilter,
  IoGlobeOutline,
  IoSearch,
} from "react-icons/io5";
import { GradientButton } from "../core/gradient-button";

const useStyles = createStyles((theme) => ({
  filters: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.lg,
    marginTop: theme.spacing.lg,

    [theme.fn.smallerThan("lg")]: {
      marginTop: theme.spacing.md,
      flexDirection: "column",
      alignItems: "flex-start",
      gap: theme.spacing.xxs,
    },
  },

  multiSelect: {
    flexShrink: 0,

    [theme.fn.smallerThan("lg")]: {
      width: "100%",
    },
  },

  searchInput: {
    [theme.fn.smallerThan("lg")]: {
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

export type Filter = {
  searchTerm: string;
  visibleServices: string[];
  officialOnly: boolean;
  newOnly: boolean;
};

export type CommunityFiltersProps = {
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
};

export function CommunityFilters({ filter, setFilter }: CommunityFiltersProps) {
  const { classes } = useStyles();
  const { uniqueServiceList } = useSubredditData();
  const router = useRouter();

  const setFilterAndPushParams = useCallback(
    (newFilter: Partial<Filter>) => {
      setFilter((prev) => {
        router.push({ query: { ...prev, ...newFilter } });
        return { ...prev, ...newFilter };
      });
    },
    [setFilter]
  );

  const [opened, { open, close }] = useDisclosure(false);
  const onChangeSearchTerm = useCallback(
    (value: string) => setFilterAndPushParams({ searchTerm: value }),
    [setFilterAndPushParams]
  );

  const filters = useMemo(
    () => (
      <div className={classes.filters}>
        <TextInput
          data-autofocus
          placeholder="Search"
          value={filter.searchTerm}
          size="md"
          onChange={(e) => onChangeSearchTerm(e.currentTarget.value)}
          icon={<IoSearch />}
          rightSection={<IoCloseOutline onClick={() => onChangeSearchTerm("")} />}
          className={classes.searchInput}
        />
        <MultiSelect
          clearButtonProps={{ "aria-label": "Clear services" }}
          icon={<IoGlobeOutline />}
          className={classes.multiSelect}
          aria-label="Select services"
          placeholder="Select services"
          size="md"
          data={uniqueServiceList}
          value={filter.visibleServices}
          onChange={(newServices) => {
            if (newServices.length) {
              setFilterAndPushParams({ visibleServices: newServices });
            }
          }}
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
          checked={filter.officialOnly}
          onChange={(e) => setFilterAndPushParams({ officialOnly: e.target.checked })}
        />
        <Checkbox
          classNames={{ body: classes.checkbox }}
          style={{ flexShrink: 0, alignItems: "center" }}
          label={
            <Tooltip label="Links that have been added in the past 24 hours" withArrow>
              <Text className={classes.officialOnly}>New only</Text>
            </Tooltip>
          }
          checked={filter.newOnly}
          onChange={(e) => setFilterAndPushParams({ newOnly: e.target.checked })}
        />
      </div>
    ),
    [filter, setFilterAndPushParams, uniqueServiceList, classes, onChangeSearchTerm]
  );

  return (
    <>
      <MediaQuery largerThan="xs" styles={{ display: "none" }}>
        <GradientButton mt="lg" onClick={open} leftIcon={<IoFilter />}>
          Filters
        </GradientButton>
      </MediaQuery>
      <MediaQuery largerThan="xs" styles={{ display: "none" }}>
        <Drawer opened={opened} onClose={close} title="Filters">
          {filters}
          <GradientButton mt="lg" onClick={close} fullWidth>
            Apply
          </GradientButton>
        </Drawer>
      </MediaQuery>
      <MediaQuery smallerThan="xs" styles={{ display: "none" }}>
        {filters}
      </MediaQuery>
    </>
  );
}
