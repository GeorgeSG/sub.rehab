import { ActionIcon, Anchor, Group, Text, Tooltip, createStyles } from "@mantine/core";
import { IoHeartOutline, IoLogoGithub } from "react-icons/io5";
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

  return (
    <footer className={classes.footer}>
      <div className={classes.inner}>
        <Logotype size="1.8rem" />
        <Text size="sm" sx={{ lineHeight: "2.5rem" }}>
          Made with <IoHeartOutline /> by <Anchor href="https://gar.dev">gar.dev</Anchor>.
        </Text>
        <Group spacing={0} className={classes.links} noWrap>
          <Tooltip label="sub.rehab @ GitHub" position="top" withArrow>
            <Anchor href="https://github.com/GeorgeSG/sub.rehab" target="_blank">
              <ActionIcon name="sub.rehab @ GitHub">
                <IoLogoGithub size={32} />
              </ActionIcon>
            </Anchor>
          </Tooltip>
        </Group>
      </div>
    </footer>
  );
}
