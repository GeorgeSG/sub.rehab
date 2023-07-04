import { Box, Tooltip, createStyles } from "@mantine/core";
import { useMemo } from "react";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { CommunityLink, Link } from "./community-link";
import { Subreddit } from "@/types";

const useStyles = createStyles(({ colors, colorScheme, fontSizes }) => {
  const isDark = colorScheme === "dark";

  return {
    section: {
      position: "relative",
      display: "flex",
      fontWeight: 700,
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

type CommunityLinkListProps = Subreddit;

export function CommunityLinkList({ name, links }: CommunityLinkListProps) {
  const { classes } = useStyles();

  const officialLinks = useMemo(() => links.filter((link) => link.official), [links]);
  const unofficialLinks = useMemo(() => links.filter((link) => !link.official), [links]);

  return (
    <>
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
    </>
  );
}
