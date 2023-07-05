import {
  ActionIcon,
  Burger,
  Button,
  Group,
  Menu,
  Tooltip,
  createStyles,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  IoChatbubbleOutline,
  IoCogOutline,
  IoHelpCircleOutline,
  IoLogoGithub,
  IoLogoMastodon,
  IoLogoReddit,
  IoMailOpen,
} from "react-icons/io5";
import { Logotype } from "./logotype";

const useStyles = createStyles(({ spacing, shadows, radius, colorScheme, fn, colors }) => ({
  title: {
    display: "flex",
    alignItems: "center",
    marginBottom: spacing.xxl,
    justifyContent: "space-between",
    gap: spacing.sm,

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

  links: {
    [fn.smallerThan(840)]: {
      display: "none",
    },
  },

  burger: {
    [fn.largerThan(840)]: {
      display: "none",
    },
  },

  menuDropdown: {
    background: colorScheme === "dark" ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
  },
}));

export function PageHeader({ withBackground = false }: { withBackground?: boolean }) {
  const { classes } = useStyles();
  const { colorScheme } = useMantineColorScheme();
  const router = useRouter();

  const [burgerOpened, { toggle: toggleBurger }] = useDisclosure(false);
  const label = burgerOpened ? "Close navigation" : "Open navigation";

  const isDark = colorScheme === "dark";

  const [homeView] = useLocalStorage<"communities" | "subreddits">({
    key: "sub-rehab-index-view",
    defaultValue: "communities",
  });

  return (
    <>
      {/* <Drawer opened={burgerOpened} onClose={toggleBurger} title="Navigation"></Drawer> */}
      <header className={`${classes.title} ${withBackground && classes.background}`}>
        <Logotype />
        <Menu
          width={200}
          shadow="md"
          onClose={toggleBurger}
          withArrow
          withinPortal
          position="bottom"
        >
          <Menu.Target>
            <Burger
              opened={burgerOpened}
              onClick={toggleBurger}
              aria-label={label}
              size="sm"
              className={classes.burger}
            />
          </Menu.Target>

          <Menu.Dropdown className={classes.menuDropdown}>
            <Menu.Item
              closeMenuOnClick
              component={Link}
              href="/"
              color={isDark ? "gray.3" : "gray.7"}
              icon={
                homeView === "communities" ? (
                  <IoChatbubbleOutline size={20} />
                ) : (
                  <IoLogoReddit size={20} />
                )
              }
            >
              {homeView === "communities" ? "Communities" : "Subreddits"}
            </Menu.Item>
            <Menu.Item
              closeMenuOnClick
              component={Link}
              href="/faq"
              color={isDark ? "gray.3" : "gray.7"}
              icon={<IoHelpCircleOutline size={22} />}
            >
              FAQ
            </Menu.Item>
            <Menu.Item
              closeMenuOnClick
              component={Link}
              href="/settings"
              color={isDark ? "gray.3" : "gray.7"}
              icon={<IoCogOutline size={22} />}
            >
              Settings
            </Menu.Item>
            <Menu.Divider />
            <Menu.Label>External links</Menu.Label>
            <Menu.Item
              closeMenuOnClick
              component={Link}
              href="https://www.buymeacoffee.com/subrehab"
              target="_blank"
              color={isDark ? "gray.3" : "gray.7"}
              icon="☕"
            >
              Buy me a coffee
            </Menu.Item>
            <Menu.Item
              closeMenuOnClick
              component={Link}
              href="https://forms.gle/JyGMtzet2Y3Kj2i8A"
              target="_blank"
              color={isDark ? "gray.3" : "gray.7"}
              icon={<IoMailOpen size={22} />}
            >
              Give Feedback
            </Menu.Item>
            <Menu.Item
              closeMenuOnClick
              color={isDark ? "gray.3" : "gray.7"}
              component="a"
              href="https://mastodon.social/@subrehab"
              target="_blank"
              title="@sub.rehab@mastodon.social"
              rel="me"
              icon={<IoLogoMastodon size={18} />}
            >
              Mastodon
            </Menu.Item>
            <Menu.Item
              closeMenuOnClick
              color={isDark ? "gray.3" : "gray.7"}
              component="a"
              href="https://github.com/GeorgeSG/sub.rehab"
              target="_blank"
              title="sub.rehab @ GitHub"
              icon={<IoLogoGithub size={18} />}
            >
              GitHub
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        <Group spacing="xs" className={classes.links}>
          <Button
            component={Link}
            href="/faq"
            variant="subtle"
            color={isDark ? "#C1C2C5" : "orange.6"}
            leftIcon={<IoHelpCircleOutline size={18} />}
          >
            FAQ
          </Button>
          <Button
            component={Link}
            href="https://www.buymeacoffee.com/subrehab"
            target="_blank"
            variant="subtle"
            color={isDark ? "#C1C2C5" : "orange.6"}
            leftIcon="☕"
          >
            Buy me a coffee
          </Button>
          <Button
            component={Link}
            href="https://forms.gle/JyGMtzet2Y3Kj2i8A"
            target="_blank"
            variant="subtle"
            color={isDark ? "#C1C2C5" : "orange.6"}
            leftIcon={<IoMailOpen size={18} />}
          >
            Give Feedback
          </Button>
          <Tooltip label="@sub.rehab@mastodon.social" position="top" withArrow>
            <ActionIcon
              size="lg"
              color={isDark ? "#C1C2C5" : "orange.6"}
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
              color={isDark ? "#C1C2C5" : "orange.6"}
              component="a"
              href="https://github.com/GeorgeSG/sub.rehab"
              target="_blank"
              title="sub.rehab @ GitHub"
            >
              <IoLogoGithub size={20} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Settings" position="top" withArrow>
            <ActionIcon
              onClick={() => router.push("/settings")}
              size="lg"
              color={isDark ? "#C1C2C5" : "orange.6"}
              title="Settings"
            >
              <IoCogOutline size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </header>
    </>
  );
}
