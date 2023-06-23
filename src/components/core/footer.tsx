import {
  ActionIcon,
  Anchor,
  Group,
  Text,
  Tooltip,
  createStyles,
  useMantineColorScheme,
} from "@mantine/core";
import { IoHeartOutline, IoLogoGithub, IoLogoMastodon } from "react-icons/io5";
import { Logotype } from "./logotype";

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: "auto",
    paddingTop: "4rem",
  },

  inner: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
      gap: 0,
    },
  },

  links: {
    marginLeft: "auto",
    [theme.fn.smallerThan("xs")]: {
      marginLeft: 0,
    },
  },
}));

export function Footer() {
  const { classes } = useStyles();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <footer className={classes.footer}>
      <div className={classes.inner}>
        <Logotype size="1.8rem" />
        <Text size="sm" sx={{ lineHeight: "2.5rem" }}>
          Made with <IoHeartOutline /> by <Anchor href="https://gar.dev">gar.dev</Anchor>.
        </Text>
        <Group spacing="sm" className={classes.links} noWrap>
          <Tooltip label="@sub.rehab@mastodon.social" position="top" withArrow>
            <ActionIcon
              color={isDark ? "gray.4" : "gray.8"}
              component="a"
              href="https://mastodon.social/@subrehab"
              target="_blank"
              rel="me"
              title="@sub.rehab@mastodon.social"
            >
              <IoLogoMastodon size={24} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="sub.rehab @ GitHub" position="top" withArrow>
            <ActionIcon
              color={isDark ? "gray.4" : "gray.8"}
              component="a"
              href="https://github.com/GeorgeSG/sub.rehab"
              target="_blank"
              title="sub.rehab @ GitHub"
            >
              <IoLogoGithub size={24} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </div>
    </footer>
  );
}
