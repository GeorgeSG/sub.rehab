import {
  ActionIcon,
  Button,
  Group,
  Indicator,
  Tooltip,
  createStyles,
  useMantineColorScheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoCogOutline, IoLogoGithub, IoLogoMastodon } from "react-icons/io5";
import { Logotype } from "./logotype";

const useStyles = createStyles(({ spacing, shadows, radius, colorScheme, fn }) => ({
  title: {
    display: "flex",
    alignItems: "center",
    marginBottom: spacing.xxl,
    justifyContent: "space-between",
    gap: spacing.sm,

    [fn.smallerThan("xs")]: {
      flexDirection: "column",
      marginBottom: spacing.md,
    },
  },

  background: {
    background: colorScheme === "dark" ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    padding: "3rem",
    boxShadow: shadows.sm,
    borderRadius: radius.md,

    [fn.smallerThan("md")]: {
      padding: "2rem",
    },

    [fn.smallerThan("xs")]: {
      padding: "1.3rem",
    },
  },
}));

export function PageHeader({ withBackground = false }: { withBackground?: boolean }) {
  const { classes } = useStyles();
  const { colorScheme } = useMantineColorScheme();
  const isSmallScreen = useMediaQuery("(max-width: 30em)");
  const router = useRouter();

  const isDark = colorScheme === "dark";

  return (
    <header className={`${classes.title} ${withBackground && classes.background}`}>
      <Logotype />
      <Group spacing="xs">
        <Button
          component={Link}
          href="/faq"
          variant="subtle"
          color={isDark ? "#C1C2C5" : "orange.5"}
        >
          FAQ
        </Button>
        <Button
          component={Link}
          href="https://www.buymeacoffee.com/subrehab"
          target="_blank"
          variant="subtle"
          color={isDark ? "#C1C2C5" : "orange.5"}
          leftIcon={isSmallScreen ? null : "☕"}
        >
          {isSmallScreen ? "Donate" : "Buy me a coffee"}
        </Button>

        <Tooltip label="@sub.rehab@mastodon.social" position="top" withArrow>
          <ActionIcon
            size="lg"
            color={isDark ? "#C1C2C5" : "orange.5"}
            variant="subtle"
            component="a"
            href="https://mastodon.social/@subrehab"
            title="@sub.rehab@mastodon.social"
            target="_blank"
            rel="me"
          >
            <IoLogoMastodon size={20} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="sub.rehab @ GitHub" position="top" withArrow>
          <ActionIcon
            size="lg"
            color={isDark ? "#C1C2C5" : "orange.5"}
            component="a"
            href="https://github.com/GeorgeSG/sub.rehab"
            target="_blank"
            title="sub.rehab @ GitHub"
          >
            <IoLogoGithub size={20} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Settings" position="top" withArrow>
          <Indicator size={7} processing offset={5} color={isDark ? "indigo.3" : "indigo.6"}>
            <ActionIcon
              onClick={() => router.push("/settings")}
              size="lg"
              color={isDark ? "#C1C2C5" : "orange.5"}
              title="Settings"
            >
              <IoCogOutline size={20} />
            </ActionIcon>
          </Indicator>
        </Tooltip>
      </Group>
    </header>
  );
}
