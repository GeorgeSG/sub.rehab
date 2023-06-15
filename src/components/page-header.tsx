import { ActionIcon, Button, Group, createStyles, useMantineColorScheme } from "@mantine/core";
import Link from "next/link";
import { IoMoon, IoSunnyOutline } from "react-icons/io5";
import { Logotype } from "./logotype";

const useStyles = createStyles(({ spacing, shadows, radius, colorScheme, fn }) => ({
  title: {
    display: "flex",
    alignItems: "center",
    marginBottom: spacing.xxl,
    [fn.smallerThan("xs")]: {
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
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const isDark = colorScheme === "dark";

  return (
    <header className={`${classes.title} ${withBackground && classes.background}`}>
      <Logotype />
      <Group ml="auto">
        <Button component={Link} href="/faq" variant="subtle">
          FAQ
        </Button>
        <ActionIcon
          size="lg"
          color={isDark ? "yellow" : "indigo"}
          onClick={() => toggleColorScheme()}
          title="Toggle color scheme"
        >
          {isDark ? <IoSunnyOutline /> : <IoMoon />}
        </ActionIcon>
      </Group>
    </header>
  );
}
