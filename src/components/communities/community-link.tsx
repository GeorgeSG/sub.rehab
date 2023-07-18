/* eslint-disable @next/next/no-img-element */
import { useHomeInstance } from "@/hooks/use-home-instance";
import { useIsLinkNew } from "@/hooks/use-is-link-new";
import { Flex, Indicator, Text, Tooltip, createStyles } from "@mantine/core";
import {
  IoChatboxEllipses,
  IoChatbubbles,
  IoCheckmarkCircleOutline,
  IoPerson,
  IoTrendingUp,
} from "react-icons/io5";
import { LinkPill } from "../core/link-pill";
import { OriginalInstanceLink } from "../original-instance-link";
import lemmyStats from "@/lemmyStats";

const SERVICE_ICONS: Record<string, string> = {
  discord: "/images/discord.svg",
  lemmy: "/images/lemmy.svg",
  kbin: "/images/kbin.svg",
  misc: "/images/web.svg",
  matrix: "/images/matrix.png",
  squabbles: "/images/squabbles.png",
  raddle: "/images/raddle.svg",
};

const useStyles = createStyles(({ colors, colorScheme, spacing, radius }) => {
  const isDark = colorScheme === "dark";

  return {
    homeLocation: {
      ":not(&:last-child)": {
        marginBottom: spacing.sm,
      },
    },
    official: {
      height: "20px",
    },
    icon: {
      color: isDark ? colors.orange[1] : colors.orange[6],
    },
  };
});

export type Link = {
  service: string;
  url: string;
  official?: boolean;
  added_ts?: number;
};

export function CommunityLink({ link, name }: { link: Link; name: string }) {
  const { classes } = useStyles();
  const { supportsHomeInstance, getSubredditLink } = useHomeInstance();
  const isLinkNew = useIsLinkNew();

  // @ts-expect-error
  const stats = lemmyStats && lemmyStats.hasOwnProperty(link.url) ? lemmyStats[link.url] : null;

  return (
    <LinkPill
      key={link.url}
      href={getSubredditLink(link)}
      target="_blank"
      title={getSubredditLink(link).split("https://")[1]}
      className={classes.homeLocation}
      statRow={
        stats && (
          <Flex gap="md" pt={2} align="center" justify="center">
            <Tooltip label="Subscribers" withArrow>
              <span>
                <IoPerson size={14} className={classes.icon} style={{ marginRight: "4px" }} />
                {stats.subscribers}
              </span>
            </Tooltip>
            <Tooltip label="Posts" withArrow>
              <span>
                <IoChatboxEllipses
                  size={14}
                  className={classes.icon}
                  style={{ marginRight: "4px" }}
                />
                {stats.posts}
              </span>
            </Tooltip>
            <Tooltip label="Comments" withArrow>
              <span>
                <IoChatbubbles size={14} className={classes.icon} style={{ marginRight: "4px" }} />
                {stats.comments}
              </span>
            </Tooltip>
            <Tooltip label="Active Users (Week)" withArrow>
              <span>
                <IoTrendingUp size={14} className={classes.icon} style={{ marginRight: "4px" }} />
                {stats.users_active_week}
              </span>
            </Tooltip>
          </Flex>
        )
      }
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
            <Text className={`${classes.official} ${classes.icon}`}>
              <IoCheckmarkCircleOutline size={20} />
            </Text>
          </Tooltip>
        )}
      </Flex>
    </LinkPill>
  );
}
