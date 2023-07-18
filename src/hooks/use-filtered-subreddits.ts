import { Filter } from "@/components/communities/community-filters";
import { getSubreddits, useSubredditData } from "@/data";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useFavorites } from "./use-favorites";
import { useIsLinkNew } from "./use-is-link-new";
import { apply, maxBy, sortBy } from "ramda";
import { Link } from "@/types";

export function useFilteredSubreddits(pageSize: number) {
  const [favorites] = useFavorites();
  const { uniqueServiceList } = useSubredditData();
  const router = useRouter();
  const isLinkNew = useIsLinkNew();

  // -- Page management
  const [page, setPage] = useState(1);
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

  // -- /Page management

  // -- Filter management
  const [filter, setFilter] = useState<Filter>({
    searchTerm: "",
    visibleServices: uniqueServiceList,
    officialOnly: false,
    newOnly: false,
    favoriteOnly: false,
    sortBy: "name",
  });

  useEffect(() => {
    // Refresh page when filter changes
    setPage(1);
  }, [filter]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlVisibleServices =
        typeof router.query.visibleServices === "string"
          ? [router.query.visibleServices]
          : router.query.visibleServices;

      setFilter({
        searchTerm: (router.query.searchTerm as string) || "",
        visibleServices: urlVisibleServices || uniqueServiceList,
        officialOnly: (router.query.officialOnly as string) === "true" || false,
        newOnly: (router.query.newOnly as string) === "true" || false,
        favoriteOnly: (router.query.favoriteOnly as string) === "true" || false,
        sortBy: (router.query.sortBy as Filter["sortBy"]) || "name",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  const isLinkVisible = useCallback(
    (link: any) =>
      filter.visibleServices.includes(link.service) &&
      (!filter.officialOnly || link.official) &&
      (!filter.newOnly || isLinkNew(link.added_ts)),
    [filter, isLinkNew]
  );

  const isSubVisible = useCallback(
    (sub: any) => {
      return (
        sub.name.toLowerCase().includes(filter.searchTerm.toLowerCase()) &&
        sub.links.some(isLinkVisible) &&
        (!filter.favoriteOnly || favorites.includes(sub.name))
      );
    },
    [filter, favorites, isLinkVisible]
  );

  const filteredSubreddits = useMemo(
    () => getSubreddits().filter((sub) => isSubVisible(sub)),
    [isSubVisible]
  );

  const maxFn = maxBy((link: Link) => link.stats?.subscribers ?? 0);

  const visibleSubreddits = useMemo(() => {
    let result = filteredSubreddits.sort((a, b) => {
      if (favorites.includes(a.name) && !favorites.includes(b.name)) {
        return -1;
      }
      if (!favorites.includes(a.name) && favorites.includes(b.name)) {
        return 1;
      }

      if (filter.sortBy !== "name") {
        return (
          apply(
            Math.max,
            b.links.map((link) => link.stats?.[filter.sortBy] ?? 0)
          ) -
          apply(
            Math.max,
            a.links.map((link) => link.stats?.[filter.sortBy] ?? 0)
          )
        );
      }

      return a.name.localeCompare(b.name);
    });

    if (filter.sortBy !== "name") {
      result = result.map((sub) => {
        return {
          ...sub,
          links: sub.links.sort(
            (a, b) => (b.stats?.[filter.sortBy] ?? 0) - (a.stats?.[filter.sortBy] ?? 0)
          ),
        };
      });
    }

    return result.slice(0, page * pageSize);
  }, [favorites, filteredSubreddits, page, pageSize, filter]);

  return { filter, setFilter, visibleSubreddits, isLinkVisible };
}
