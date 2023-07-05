import { CommunityFavorite } from "@/components/communities/community-favorite";
import { CommunityLinkList } from "@/components/communities/community-link-list";
import { PageHeader } from "@/components/core/page-header";
import { Section } from "@/components/core/section";
import { getAllSubredditNames, getSubredditData } from "@/data";
import { Subreddit } from "@/types";
import { Box, Flex, Title } from "@mantine/core";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

export const getStaticPaths: GetStaticPaths = async () => {
  const subreddits = getAllSubredditNames();

  return {
    paths: subreddits.map((sub) => ({ params: { subreddit: sub.split("r/")[1].toLowerCase() } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{
  subreddit: Subreddit;
}> = async (context) => {
  const subParam = context.params?.subreddit as string;

  if (!subParam) {
    return { notFound: true };
  }

  const sub = getSubredditData(`r/${subParam}`);
  if (sub) {
    return { props: { subreddit: sub } };
  }

  return { notFound: true };
};

export default function SubredditPage({
  subreddit: { name, links },
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PageHeader withBackground />
      <Section>
        <Flex align="center" gap="md">
          <Title order={2} sx={{ fontFamily: "var(--font-accent)" }}>
            {name}
          </Title>
          <CommunityFavorite name={name} />
        </Flex>
        <Box maw="400px" mt="xxl">
          <CommunityLinkList name={name} links={links} />
        </Box>
      </Section>
    </>
  );
}
