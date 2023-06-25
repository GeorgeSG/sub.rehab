import { Box, Flex, Title, Tooltip, createStyles } from "@mantine/core";
import { CommunityFavorite } from "./community-favorite";
import { CommunityLink, Link } from "./community-link";
import { useMemo } from "react";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

type CommunityProps = {
  name: string;
  links: Link[];
};

const useStyles = createStyles(({ colors, colorScheme, spacing, radius, fn, fontSizes }) => {
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

    communityName: {
      color: isDark ? colors.orange[1] : colors.gray[8],
      fontSize: "1.125rem",
    },

    section: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      marginBottom: "4px",
      color: colors.gray[6],
      fontSize: fontSizes.xs,
      textTransform: "uppercase",

      "&::after": {
        display: "block",
        content: '""',
        width: "100%",
        height: "1px",
        background: isDark ? colors.gray[8] : colors.gray[3],
      },
    },
  };
});

export function Community({ name, links }: CommunityProps) {
  const { classes } = useStyles();

  const officialLinks = useMemo(() => links.filter((link) => link.official), [links]);
  const unofficialLinks = useMemo(() => links.filter((link) => !link.official), [links]);

  return (
    <div className={classes.community}>
      <Flex align="center" justify="space-between" mb="xs">
        <Title order={3} className={classes.communityName}>
          {name}
        </Title>
        <CommunityFavorite name={name} />
      </Flex>
      {officialLinks.length > 0 && (
        <Tooltip
          label="Communities officially endorsed or created by the original subreddit's staff"
          withArrow
        >
          <div className={classes.section}>
            <IoCheckmarkCircleOutline size={17} />
            <span style={{ display: "inline-block", flexShrink: 0, paddingRight: "6px" }}>
              &nbsp;official
            </span>
          </div>
        </Tooltip>
      )}
      {officialLinks.map((link) => (
        <CommunityLink link={link} key={link.url} name={name} />
      ))}
      {unofficialLinks.length > 0 && (
        <Box className={classes.section} mt="md">
          <span style={{ flexShrink: 0, paddingRight: "6px" }}>spin-offs</span>
        </Box>
      )}
      {unofficialLinks.map((link) => (
        <CommunityLink link={link} key={link.url} name={name} />
      ))}
    </div>
  );
}
