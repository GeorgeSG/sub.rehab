import { GradientButton } from "@/components/core/gradient-button";
import { PageHeader } from "@/components/core/page-header";
import { Section } from "@/components/core/section";
import { AnimatedSlogan } from "@/components/index/animated-slogan";
import { CommunityList } from "@/components/index/community-list";
import { Statistics } from "@/components/index/statistics";
import { Anchor, Button, Flex, Text, createStyles } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoAdd, IoStatsChart } from "react-icons/io5";

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
}));

export default function Home() {
  const { classes } = useStyles();
  const router = useRouter();

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
        <Flex gap="xs">
          <GradientButton<typeof Link> component={Link} href="/submit-link" leftIcon={<IoAdd />}>
            Suggest link
          </GradientButton>
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
      <CommunityList />
    </>
  );
}
