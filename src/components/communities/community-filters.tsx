import { useSubredditData } from "@/data";
import {
  Checkbox,
  Drawer,
  Flex,
  MediaQuery,
  MultiSelect,
  Text,
  TextInput,
  Tooltip,
  createStyles,
} from "@mantine/core";
import { useDebouncedState, useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
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

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
      alignItems: "flex-start",
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
  favoriteOnly: boolean;
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
        router.push({ query: { ...prev, ...newFilter } }, undefined, { scroll: false });
        return { ...prev, ...newFilter };
      });
    },
    // omitting router.push from deps because it'll cause an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setFilter]
  );

  const [opened, { open, close }] = useDisclosure(false);

  const onChangeSearchTerm = useCallback(
    (value: string) => setFilterAndPushParams({ searchTerm: value }),
    [setFilterAndPushParams]
  );

  const [localSearchTerm, setLocalSearchTerm] = useState(filter.searchTerm);
  const [debouncedSearchTerm] = useDebouncedValue(localSearchTerm, 300);

  useEffect(() => {
    onChangeSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, onChangeSearchTerm]);

  const filters = useMemo(
    () => (
      <Flex direction="column" gap="md">
        <div className={classes.filters}>
          <TextInput
            data-autofocus
            placeholder="Subreddit name"
            value={localSearchTerm}
            size="md"
            onChange={(e) => setLocalSearchTerm(e.currentTarget.value)}
            icon={<IoSearch />}
            rightSection={<IoCloseOutline onClick={() => setLocalSearchTerm("")} />}
            className={classes.searchInput}
          />
          <Checkbox
            classNames={{ body: classes.checkbox }}
            style={{ flexShrink: 0, alignItems: "center" }}
            label={
              <Tooltip
                label="Communities we've verified as endorsed or created by the original subreddit's staff"
                withArrow
              >
                <Text className={classes.officialOnly}>
                  Official
                  <IoCheckmarkCircleOutline size="1rem" />
                </Text>
              </Tooltip>
            }
            checked={filter.officialOnly}
            onChange={(e) => {
              setFilterAndPushParams({ officialOnly: e.target.checked });
              umami?.track("filterByOfficial", { filter: e.target.checked });
            }}
          />
          <Checkbox
            classNames={{ body: classes.checkbox }}
            style={{ flexShrink: 0, alignItems: "center" }}
            label={<Text className={classes.officialOnly}>Favorites</Text>}
            checked={filter.favoriteOnly}
            onChange={(e) => {
              setFilterAndPushParams({ favoriteOnly: e.target.checked });
              umami?.track("filterByFavorite", { filter: e.target.checked });
            }}
          />
          <Checkbox
            classNames={{ body: classes.checkbox }}
            style={{ flexShrink: 0, alignItems: "center" }}
            label={
              <Tooltip label="Links that have been added in the past 24 hours" withArrow>
                <Text className={classes.officialOnly}>New</Text>
              </Tooltip>
            }
            checked={filter.newOnly}
            onChange={(e) => {
              setFilterAndPushParams({ newOnly: e.target.checked });
              umami?.track("filterByNew", { filter: e.target.checked });
            }}
          />
        </div>
        <MultiSelect
          clearButtonProps={{ "aria-label": "Clear services" }}
          left={"hui"}
          icon={
            <Flex gap={8} align="center">
              <IoGlobeOutline />
              <Text size="sm">Service:</Text>
            </Flex>
          }
          styles={{
            icon: {
              width: "100px",
            },
            input: {
              paddingLeft: "100px !important",
            },
          }}
          className={classes.multiSelect}
          aria-label="Select services"
          placeholder="Select services"
          size="md"
          data={uniqueServiceList}
          value={filter.visibleServices}
          onChange={(newServices) => {
            if (newServices.length) {
              setFilterAndPushParams({ visibleServices: newServices });
            } else {
              notifications.show({
                color: "red",
                title: "Ooops 🙈",
                message: "There must always be at least one service selected",
              });
            }
          }}
          withinPortal
        />
      </Flex>
    ),
    [filter, setFilterAndPushParams, uniqueServiceList, classes, localSearchTerm]
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
