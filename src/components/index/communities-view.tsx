import { SimpleGrid } from "@mantine/core";
import { CommunityCard } from "../communities/community-card";
import { useFilteredSubreddits } from "@/hooks/use-filtered-subreddits";

export function CommunitiesView() {
  const { visibleSubreddits, isLinkVisible } = useFilteredSubreddits(30);

  return (
    <SimpleGrid
      cols={3}
      spacing="lg"
      mt="xxl"
      breakpoints={[
        { maxWidth: "lg", cols: 2, spacing: "lg" },
        { maxWidth: "sm", cols: 1, spacing: "md" },
      ]}
    >
      {visibleSubreddits.map(({ name, links }) => (
        <CommunityCard key={name} name={name} links={links.filter(isLinkVisible)} />
      ))}
    </SimpleGrid>
  );
}
