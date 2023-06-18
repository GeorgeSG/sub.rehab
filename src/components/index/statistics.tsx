import { StatisticCard } from "@/components/core/statistic-card";
import { SERVICE_COLORS, useSubredditData } from "@/data";
import { ColorSwatch, Flex, SimpleGrid, useMantineTheme } from "@mantine/core";
import { useMemo } from "react";

export function Statistics() {
  const theme = useMantineTheme();

  const { communitiesCount, linksCount, officialLinksCount, countPerService } = useSubredditData();

  const sortedSections = useMemo(
    () => Object.entries(countPerService).sort((a, b) => b[1] - a[1]),
    [countPerService]
  );

  const progressSections = sortedSections.map(([service, count]) => ({
    value: (count / linksCount) * 100,
    color: SERVICE_COLORS[service]?.(theme),
  }));

  return (
    <Flex gap="md" wrap="wrap" mb="lg">
      <StatisticCard title="Subreddits" value={communitiesCount} />
      <StatisticCard title="Official Links" value={officialLinksCount} />
      <StatisticCard title="Total Links" value={linksCount} />
      <StatisticCard
        progress={{
          size: 80,
          thickness: 8,
          sections: progressSections,
        }}
      >
        <SimpleGrid cols={2} spacing="xs" mt="0">
          {sortedSections.map(([service, count]) => (
            <Flex key={service} align="center" gap="xxs" style={{ fontSize: "0.8rem" }}>
              <ColorSwatch color={SERVICE_COLORS[service](theme)} size={16} />
              <span>
                {service}: <strong>{count}</strong>
              </span>
            </Flex>
          ))}
        </SimpleGrid>
      </StatisticCard>
    </Flex>
  );
}
