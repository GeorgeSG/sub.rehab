import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { Accordion, Anchor, List, Text, Title, createStyles } from "@mantine/core";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

const useStyles = createStyles((theme) => ({
  item: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : "#fff",
    borderRadius: theme.radius.md,
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7],
  },
}));

export default function FAQPage() {
  const { classes } = useStyles();
  return (
    <>
      <PageHeader withBackground />
      <Section>
        <Title order={2} mb="lg" sx={{ fontFamily: "var(--font-accent)" }}>
          Answers
        </Title>
        <Accordion chevronPosition="right" defaultValue="reset-password" variant="separated">
          <Accordion.Item className={classes.item} value="reset-password">
            <Accordion.Control>What is the Reddit protest?</Accordion.Control>
            <Accordion.Panel>
              <Text>
                Some Reddit communities are protesting due to recent announcement for API changes.
                The changes will introduce charges for API access that will kill third-party
                applications like Apollo, Boost, rif, and others.
              </Text>
              <p>For more information, see:</p>
              <List>
                <List.Item>
                  <Anchor
                    href="https://old.reddit.com/r/Save3rdPartyApps"
                    target="_blank"
                    rel="noreferrer"
                  >
                    /r/Save3rdPartyApps
                  </Anchor>
                </List.Item>
                <List.Item>
                  <Anchor href="https://old.reddit.com/r/ModCoord" target="_blank" rel="noreferrer">
                    /r/ModCoord
                  </Anchor>
                </List.Item>
                <List.Item>
                  <Anchor
                    href="https://www.theguardian.com/technology/2023/jun/11/reddit-communities-to-go-dark-in-protest-over-third-party-app-charges"
                    target="_blank"
                    rel="noreferrer"
                  >
                    &quot;Reddit communities to &apos;go dark&apos; in protest over third-party app
                    charges&quot; by The Guardian
                  </Anchor>
                </List.Item>
                <List.Item>
                  <Anchor href="https://reddark.untone.uk/" target="_blank" rel="noreferrer">
                    Reddark
                  </Anchor>
                </List.Item>
              </List>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item className={classes.item} value="newsletter">
            <Accordion.Control>
              What is the verified/official <IoCheckmarkCircleOutline size="14px" /> mark?
            </Accordion.Control>
            <Accordion.Panel>
              I placed a &quot;verified&quot; mark next to links that were found in the original
              subreddit or were communicated to be an official alternative of the original
              subreddit.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item className={classes.item} value="newsletter">
            <Accordion.Control>Why create this page?</Accordion.Control>
            <Accordion.Panel>
              Communities are attempting to migrate away from Reddit, but it&apos;s hard to figure
              out where each community went. I figured a single directory of alternatives can
              improve discoverability and help the transition.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item className={classes.item} value="credit-card">
            <Accordion.Control>Is this site open-source?</Accordion.Control>
            <Accordion.Panel>
              Yes. You can find the source on GitHub at&nbsp;
              <Anchor href="https://github.com/GeorgeSG/sub.rehab" target="_blank">
                GeorgeSG/sub.rehab
              </Anchor>
              . Feel free to open a PR and contribute!
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Section>
    </>
  );
}
