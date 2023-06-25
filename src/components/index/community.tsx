import { useHomeInstance } from "@/hooks/use-home-instance";
import { useIsLinkNew } from "@/hooks/use-is-link-new";
import {
  ActionIcon,
  Anchor,
  Flex,
  Indicator,
  Text,
  Title,
  Tooltip,
  createStyles,
} from "@mantine/core";
import { useCallback, useMemo } from "react";
import { IoCheckmarkCircleOutline, IoShareOutline } from "react-icons/io5";
import { OriginalInstanceLink } from "../original-instance-link";

type Link = {
  service: string;
  url: string;
  official?: boolean;
  added_ts?: number;
};

type CommunityProps = {
  name: string;
  links: Link[];
};

const SERVICE_ICONS: Record<string, string> = {
  discord: "/images/discord.svg",
  lemmy: "/images/lemmy.svg",
  kbin: "/images/kbin.svg",
  misc: "/images/web.svg",
  matrix: "/images/matrix.png",
  squabbles: "/images/squabbles.png",
  raddle: "/images/raddle.svg",
};

const useStyles = createStyles(({ colors, colorScheme, spacing, radius, other, fn }) => {
  const isDark = colorScheme === "dark";

  return {
    community: {
      padding: spacing.md,
      border: `1px solid ${isDark ? colors.gray[8] : colors.gray[3]}`,
      backgroundColor: isDark ? colors.dark[6] : "#fff",
      borderRadius: radius.md,

      [fn.smallerThan(360)]: {
        padding: spacing.xs,
      },
    },

    homeLocation: {
      display: "flex",
      alignItems: "center",
      gap: spacing.md,
      borderRadius: radius.md,
      padding: `${spacing.xs} ${spacing.md}`,
      color: isDark ? colors.orange[1] : colors.gray[7],
      lineHeight: "32px",
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : colors.orange[0],
      transition: `background-color ${other.transitionTime} ease`,

      "&:hover": {
        backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : colors.orange[1],
        textDecoration: "none",
      },

      "& + &": {
        marginTop: spacing.sm,
      },

      [fn.smallerThan("xs")]: {
        gap: spacing.xs,
        padding: spacing.xs,
      },
    },

    communityName: {
      color: isDark ? colors.orange[1] : colors.gray[8],
      marginBottom: spacing.md,
      fontSize: "1.125rem",
    },

    official: {
      height: "20px",
      color: isDark ? colors.orange[1] : colors.orange[6],
    },
  };
});

export function Community({ name, links }: CommunityProps) {
  const { classes } = useStyles();
  const isLinkNew = useIsLinkNew();

  const { homeInstance } = useHomeInstance();

  const homeInstanceURL = useMemo(() => {
    if (homeInstance.length === 0) {
      return null;
    }
    let hs = homeInstance.replace("http://", "https://");
    hs = hs.startsWith("https://") ? hs : `https://${hs}`;

    try {
      const url = new URL(hs);
      return url;
    } catch {
      return null;
    }
  }, [homeInstance]);

  const supportsHomeInstance = (link: Link) => {
    if (link.service !== "lemmy" && link.service !== "kbin") {
      return false;
    }

    if (!homeInstanceURL) {
      return false;
    }

    const url = new URL(link.url);
    if (url.host === homeInstanceURL.host) {
      return false;
    }

    if (link.service === "lemmy") {
      return link.url.includes("/c/");
    }

    if (link.service === "kbin") {
      return link.url.includes("/m/");
    }

    return false;
  };

  const getSubredditLink = useCallback(
    (link: Link) => {
      if (supportsHomeInstance(link) && homeInstanceURL) {
        const originalUrl = new URL(link.url);
        if (originalUrl.pathname !== "/") {
          return `https://${homeInstanceURL.host}${homeInstanceURL.pathname}${
            originalUrl.pathname.split("/")[2]
          }@${originalUrl.host}`;
        }
      }

      return link.url;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [homeInstanceURL]
  );

  return (
    <div className={classes.community}>
      <Title order={3} className={classes.communityName}>
        {name}
      </Title>
      {links
        .sort((a, b) => (a.official === b.official ? 0 : a.official ? -1 : 1))
        .map((link) => (
          <Anchor
            key={link.url}
            href={getSubredditLink(link)}
            target="_blank"
            title={getSubredditLink(link).split("https://")[1]}
            className={classes.homeLocation}
          >
            {SERVICE_ICONS[link.service] && (
              <Indicator inline label="new" size={14} disabled={!isLinkNew(link.added_ts)}>
                <img
                  alt={`${name} on ${link.service}`}
                  title={`${name} on ${link.service}`}
                  src={SERVICE_ICONS[link.service]}
                  height={32}
                  width={32}
                  style={{ objectFit: "contain" }}
                />
              </Indicator>
            )}
            <Text sx={{ textOverflow: "ellipsis", overflow: "hidden", textWrap: "nowrap" }}>
              {getSubredditLink(link).split("://")[1]}
            </Text>
            <Flex ml="auto" align="center" gap="sm">
              {supportsHomeInstance(link) && <OriginalInstanceLink url={link.url} />}
              {link.official && (
                <Tooltip
                  label={
                    <>
                      verified from <strong>{name}</strong>
                    </>
                  }
                  withArrow
                >
                  <Text className={classes.official}>
                    <IoCheckmarkCircleOutline size={20} />
                  </Text>
                </Tooltip>
              )}
            </Flex>
          </Anchor>
        ))}
    </div>
  );
}
