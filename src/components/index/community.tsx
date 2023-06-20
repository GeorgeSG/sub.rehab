import { useIsLinkNew } from "@/hooks/use-is-link-new";
import { Anchor, Indicator, Title, createStyles } from "@mantine/core";
import { useCallback, useMemo } from "react";

type Link = {
  service: string;
  url: string;
  official?: boolean;
  added_ts?: number;
};

type CommunityProps = {
  name: string;
  links: Link[];
  homeInstance: string;
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

const useStyles = createStyles(({ colors, colorScheme, spacing, radius, other }) => {
  const isDark = colorScheme === "dark";

  return {
    community: {
      padding: spacing.md,
      border: `1px solid ${isDark ? colors.gray[8] : colors.gray[3]}`,
      backgroundColor: isDark ? colors.dark[6] : "#fff",
      borderRadius: radius.md,
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
    },

    communityName: {
      color: isDark ? colors.orange[1] : colors.gray[8],
      marginBottom: spacing.md,
      fontSize: "1.125rem",
    },

    official: {
      height: "20px",
      marginLeft: "auto",
      color: isDark ? colors.orange[1] : colors.orange[6],
    },
  };
});

export function Community({ name, links, homeInstance }: CommunityProps) {
  const { classes } = useStyles();
  const isLinkNew = useIsLinkNew();

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

    const url = new URL(link.url);

    return homeInstanceURL && url.host !== homeInstanceURL.host;
  };

  const getSubredditLink = useCallback(
    (link: Link) => {
      if (supportsHomeInstance(link) && homeInstanceURL) {
        const url = new URL(link.url);
        if (url.pathname !== "/") {
          return `${homeInstanceURL.host}${homeInstanceURL.pathname}${url.pathname.split("/")[2]}@${
            url.host
          }`;
        }
      }

      return link.url.split("://")[1];
    },
    [homeInstance]
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
            href={`https://${getSubredditLink(link)}`}
            target="_blank"
            title={getSubredditLink(link)}
            rel="noreferrer"
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
          </Anchor>
        ))}
    </div>
  );
}
