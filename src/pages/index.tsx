import { AnimatedSlogan } from "@/components/animated-slogan";
import { CommunityList } from "@/components/community-list";
import { GradientButton } from "@/components/gradient-button";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { Statistics } from "@/components/statistics";
import { Anchor, Button, Flex, MediaQuery, Text, TextInput, createStyles } from "@mantine/core";
import { modals } from "@mantine/modals";
import Link from "next/link";
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
          <GradientButton<"a">
            component="a"
            href="https://github.com/GeorgeSG/sub.rehab/discussions/1"
            target="_blank"
            leftIcon={<IoAdd />}
          >
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
