import { Flex, Title, createStyles } from "@mantine/core";
import { CommunityFavorite } from "./community-favorite";
import { CommunityLink, Link } from "./community-link";

type CommunityProps = {
  name: string;
  links: Link[];
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

    communityName: {
      color: isDark ? colors.orange[1] : colors.gray[8],
      fontSize: "1.125rem",
    },
  };
});

export function Community({ name, links }: CommunityProps) {
  const { classes } = useStyles();

  return (
    <div className={classes.community}>
      <Flex align="center" justify="space-between" mb="xs">
        <Title order={3} className={classes.communityName}>
          {name}
        </Title>
        <CommunityFavorite name={name} />
      </Flex>
      {links
        .sort((a, b) => (a.official === b.official ? 0 : a.official ? -1 : 1))
        .map((link) => (
          <CommunityLink link={link} key={link.url} name={name} />
        ))}
    </div>
  );
}
