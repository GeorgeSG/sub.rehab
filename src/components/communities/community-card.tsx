import { Anchor, Flex, Title, createStyles } from "@mantine/core";
import { default as NextLink } from "next/link";
import { CommunityFavorite } from "./community-favorite";
import { CommunityLinkList } from "./community-link-list";
import { Subreddit } from "@/types";

const useStyles = createStyles(({ colors, colorScheme, spacing, radius, fn }) => {
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
  };
});

type CommunityCardProps = Subreddit;

export function CommunityCard({ name, links }: CommunityCardProps) {
  const { classes } = useStyles();

  return (
    <div className={classes.community}>
      <Flex align="center" justify="space-between" mb="xs">
        <Title order={3}>
          <Anchor
            component={NextLink}
            href={`/${name.toLowerCase()}`}
            className={classes.communityName}
          >
            {name}
          </Anchor>
        </Title>
        <CommunityFavorite name={name} />
      </Flex>
      <CommunityLinkList name={name} links={links} />
    </div>
  );
}
