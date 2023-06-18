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

  const [showRulesConfirm, setShowRulesConfirm] = useLocalStorage({
    key: "sub-rehab-show-rules-confirm",
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
        <Flex gap="xs">
          <GradientButton<"a">
            component="a"
            href="https://github.com/GeorgeSG/sub.rehab/discussions/1"
            onClick={(e) => {
              if (showRulesConfirm) {
                e.preventDefault();
                modals.open({
                  title: "New Rules Requirements",
                  children: (
                    <>
                      <p>
                        Before submitting new links, please read the&nbsp;
                        <Anchor
                          href="https://github.com/GeorgeSG/sub.rehab/discussions/2"
                          target="_blank"
                        >
                          New Links requirements
                        </Anchor>
                        .
                      </p>
                      <Flex mt="sm" justify="flex-end" gap="sm">
                        <Button
                          variant="subtle"
                          onClick={() => {
                            setShowRulesConfirm(false);
                            router.push("https://github.com/GeorgeSG/sub.rehab/discussions/1");
                          }}
                        >
                          Don&apos;t show this again
                        </Button>
                        <Button
                          component="a"
                          href="https://github.com/GeorgeSG/sub.rehab/discussions/1"
                        >
                          Suggest a link
                        </Button>
                      </Flex>
                    </>
                  ),
                });
              }
            }}
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
