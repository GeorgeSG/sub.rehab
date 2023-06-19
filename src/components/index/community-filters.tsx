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
  searchParam: string;
  visibleServices: string[];
  officialOnly: boolean;
  newOnly: boolean;
};

export type CommunityFiltersProps = {
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Partial<Filter>>>;
};

export function CommunityFilters({ filter, setFilter }: CommunityFiltersProps) {
  const { classes } = useStyles();
  const { uniqueServiceList } = useSubredditData();

  const [opened, { open, close }] = useDisclosure(false);

  const onChangeSearchParam = useCallback(
    (value: string) => setFilter({ searchParam: value }),
    [setFilter]
  );

  const filters = useMemo(
    () => (
      <div className={classes.filters}>
        <TextInput
          data-autofocus
          placeholder="Search"
          value={filter.searchParam}
          size="md"
          onChange={(e) => onChangeSearchParam(e.currentTarget.value)}
          icon={<IoSearch />}
          rightSection={<IoCloseOutline onClick={() => onChangeSearchParam("")} />}
          className={classes.searchInput}
        />
        <MultiSelect
          clearable
          clearButtonProps={{ "aria-label": "Clear services" }}
          icon={<IoGlobeOutline />}
          className={classes.multiSelect}
          aria-label="Select services"
          placeholder="Select services"
          size="md"
          data={uniqueServiceList}
          value={filter.visibleServices}
          onChange={(visibleServices) => setFilter({ visibleServices })}
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
          onChange={(e) => setFilter(() => ({ officialOnly: e.target.checked }))}
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
          onChange={(e) => setFilter(() => ({ newOnly: e.target.checked }))}
        />
      </div>
    ),
    [filter, onChangeSearchParam, setFilter, uniqueServiceList, classes]
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
