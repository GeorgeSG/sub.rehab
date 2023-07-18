/* eslint-disable @next/next/no-img-element */
import { useHomeInstance } from "@/hooks/use-home-instance";
import { useIsLinkNew } from "@/hooks/use-is-link-new";
import { formatCompactNumber } from "@/lib/numbers";
import { Link } from "@/types";
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

const SERVICE_ICONS: Record<string, string> = {
  discord: "/images/discord.svg",
  lemmy: "/images/lemmy.svg",
  kbin: "/images/kbin.svg",
  misc: "/images/web.svg",
  matrix: "/images/matrix.png",
  squabbles: "/images/squabbles.png",
  raddle: "/images/raddle.svg",
};

const useStyles = createStyles(({ colors, colorScheme, spacing, radius, fn, fontSizes }) => {
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

    stats: {
      display: "flex",
      gap: spacing.md,
      alignItems: "center",
      fontSize: fontSizes.sm,
      justifyContent: "flex-start",
      paddingLeft: "48px",
    },
  };
});

export function CommunityLink({ link, name }: { link: Link; name: string }) {
  const { classes } = useStyles();
  const { supportsHomeInstance, getSubredditLink } = useHomeInstance();
  const isLinkNew = useIsLinkNew();

  return (
    <LinkPill
      key={link.url}
      href={getSubredditLink(link)}
      target="_blank"
      title={getSubredditLink(link).split("https://")[1]}
      className={classes.homeLocation}
      statRow={
        link.stats && (
          <div className={classes.stats}>
            <Tooltip label="Subscribers" withArrow>
              <span>
                <IoPerson size={11} className={classes.icon} style={{ marginRight: "4px" }} />
                {formatCompactNumber(link.stats.subscribers)}
              </span>
            </Tooltip>
            <Tooltip label="Posts" withArrow>
              <span>
                <IoChatboxEllipses
                  size={11}
                  className={classes.icon}
                  style={{ marginRight: "4px" }}
                />
                {formatCompactNumber(link.stats.posts)}
              </span>
            </Tooltip>
            <Tooltip label="Comments" withArrow>
              <span>
                <IoChatbubbles size={11} className={classes.icon} style={{ marginRight: "4px" }} />
                {formatCompactNumber(link.stats.comments)}
              </span>
            </Tooltip>
            <Tooltip label="Active Users (Week)" withArrow>
              <span>
                <IoTrendingUp size={11} className={classes.icon} style={{ marginRight: "4px" }} />
                {formatCompactNumber(link.stats.users_active_week)}
              </span>
            </Tooltip>
          </div>
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
