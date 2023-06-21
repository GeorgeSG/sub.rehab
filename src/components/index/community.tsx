import { useIsLinkNew } from "@/hooks/use-is-link-new";
import { Anchor, Indicator, Text, Title, Tooltip, createStyles } from "@mantine/core";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

type CommunityProps = {
  name: string;
  links: {
    service: string;
    url: string;
    official?: boolean;
    added_ts?: number;
  }[];
};

const SERVICE_ICONS: Record<string, string> = {
  discord: "/images/discord.svg",
  lemmy: "/images/lemmy.svg",
  kbin: "/images/kbin.svg",
  misc: "/images/web.svg",
  matrix: "/images/matrix.png",
  squabbles: "/images/squabbles.png",
  raddle: "",
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

export function Community({ name, links }: CommunityProps) {
  const { classes } = useStyles();
  const isLinkNew = useIsLinkNew();

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
            href={link.url}
            target="_blank"
            title={link.url.split("://")[1]}
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
            <Text sx={{ textOverflow: "ellipsis", overflow: "hidden", textWrap: "nowrap" }}>
              {link.url.split("://")[1]}
            </Text>
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
          </Anchor>
        ))}
    </div>
  );
}
