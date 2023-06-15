import { AnimatedSlogan } from "@/components/animated-slogan";
import { CommunityList } from "@/components/community-list";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { Anchor, Button, Text } from "@mantine/core";
import Link from "next/link";
import { IoAdd } from "react-icons/io5";

export default function Home() {
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
        <Button
          component="a"
          href="https://github.com/GeorgeSG/sub.rehab/discussions/1"
          target="_blank"
          leftIcon={<IoAdd />}
          variant="gradient"
          gradient={{ from: "orange.4", to: "orange.8", deg: 55 }}
        >
          Suggest link
        </Button>
      </Section>
      <CommunityList />
    </>
  );
}
