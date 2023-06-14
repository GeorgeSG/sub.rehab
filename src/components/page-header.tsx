import { ActionIcon, Button, ColorScheme, Group, createStyles } from "@mantine/core";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
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
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "sub-rehab-color-theme",
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const isDark = colorScheme === "dark";

  return (
    <div className={`${classes.title} ${withBackground && classes.background}`}>
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
    </div>
  );
}
