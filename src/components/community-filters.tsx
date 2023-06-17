import { useSubredditData } from "@/data";
import {
  Button,
  Checkbox,
  Drawer,
  Group,
  MediaQuery,
  MultiSelect,
  Text,
  TextInput,
  Tooltip,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { use, useCallback, useMemo } from "react";
import {
  IoCheckmarkCircleOutline,
  IoCloseOutline,
  IoFilter,
  IoGlobeOutline,
  IoSearch,
} from "react-icons/io5";

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

export type Filter = {
  searchParam: string;
  visibleServices: string[];
  officialOnly: boolean;
};

export type CommunityFiltersProps = {
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
};

export function CommunityFilters({ filter, setFilter }: CommunityFiltersProps) {
  const { classes } = useStyles();
  const { uniqueServiceList } = useSubredditData();

  const [opened, { open, close }] = useDisclosure(false);

  const onChangeSearchParam = useCallback(
    (value: string) => setFilter((prev) => ({ ...prev, searchParam: value })),
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
          className={classes.checkboxList}
          aria-label="Select services"
          placeholder="Select services"
          size="md"
          data={uniqueServiceList}
          value={filter.visibleServices}
          onChange={(visibleServices) => setFilter((prev) => ({ ...prev, visibleServices }))}
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
          onChange={(e) => setFilter((prev) => ({ ...prev, officialOnly: e.target.checked }))}
        />
      </div>
    ),
    [filter, onChangeSearchParam, setFilter, uniqueServiceList, classes]
  );

  return (
    <>
      <MediaQuery largerThan="xs" styles={{ display: "none" }}>
        <Button mt="lg" onClick={open} leftIcon={<IoFilter />}>
          Filters
        </Button>
      </MediaQuery>
      <MediaQuery largerThan="xs" styles={{ display: "none" }}>
        <Drawer opened={opened} onClose={close} title="Filters">
          {filters}
          <Button mt="lg" onClick={close} fullWidth>
            Apply
          </Button>
        </Drawer>
      </MediaQuery>
      <MediaQuery smallerThan="xs" styles={{ display: "none" }}>
        {filters}
      </MediaQuery>
    </>
  );
}
