import { Anchor, Button, Flex, Group, Text, Tooltip, createStyles } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoAdd, IoStatsChart, IoWarningOutline } from "react-icons/io5";
import { GradientButton } from "../core/gradient-button";
import { PageHeader } from "../core/page-header";
import { Section } from "../core/section";
import { AnimatedSlogan } from "./animated-slogan";
import { Statistics } from "./statistics";

const useStyles = createStyles((theme) => ({
  statisticsWrapper: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },
  statisticsModal: {
    display: "none",

    [theme.fn.smallerThan("xs")]: {
      display: "inline-flex",
    },
  },

  buttonRow: {
    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },
}));

export function IndexHeader() {
  const { classes } = useStyles();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [showSettingsTip, setShowSettingsTip] = useLocalStorage({
    key: "sub-rehab-home-settings-tip",
    defaultValue: true,
  });

  return (
    <>
      <Section>
        <PageHeader />
        <AnimatedSlogan />
        <Text mb="xl" style={{ maxWidth: "750px" }}>
          Due to the ongoing protest against Reddit&apos;s new API terms, many subreddits are either
          private or restricted.&nbsp;
          <Anchor component={Link} href="/">
            sub.rehab
          </Anchor>
          &nbsp;lists instances of the Reddit communities on alternative platforms.
        </Text>
        <div className={classes.statisticsWrapper}>
          <Statistics />
        </div>
        <Flex gap="xs" className={classes.buttonRow}>
          <Group>
            {/* <GradientButton<typeof Link> component={Link} href="/submit-link" leftIcon={<IoAdd />}>
              Suggest link
            </GradientButton> */}

            <Tooltip label="Report a broken, miscategorized, or inaccurate link" withArrow>
              <div>
                <GradientButton<typeof Link>
                  component={Link}
                  href="https://github.com/GeorgeSG/sub.rehab/discussions/9"
                  leftIcon={<IoWarningOutline />}
                >
                  Report link
                </GradientButton>
              </div>
            </Tooltip>
          </Group>
          <div className={classes.statisticsModal}>
            <Button
              variant="subtle"
              leftIcon={<IoStatsChart />}
              onClick={() =>
                modals.open({
                  title: "Stats for Nerds",
                  children: <Statistics />,
                  centered: true,
                })
              }
            >
              Stats for Nerds
            </Button>
          </div>
        </Flex>
      </Section>
      {isMounted && showSettingsTip && (
        <Section mt="xl">
          <Flex align="center" justify="space-between" wrap="wrap" gap="md">
            <Text>
              Tip: You can import your reddit subscriptions and set a Lemmy/kbin home instance from{" "}
              <Anchor component={Link} href="/settings">
                Settings
              </Anchor>
              .
            </Text>
            <Button variant="outline" onClick={() => setShowSettingsTip(false)}>
              Don&apos;t show this again
            </Button>
          </Flex>
        </Section>
      )}
    </>
  );
}
