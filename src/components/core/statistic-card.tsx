import { Group, Paper, RingProgress, RingProgressProps, Text } from "@mantine/core";
import { ReactNode } from "react";

type StatisticProps = {
  title?: string;
  value?: number;
  progress?: RingProgressProps;
  children?: ReactNode;
};

export function StatisticCard({ title, value, progress, children }: StatisticProps) {
  return (
    <Paper withBorder p="sm" radius="md" key={title} style={{ flexGrow: 1 }}>
      <Group h="100%">
        {progress && <RingProgress {...progress} />}
        <div style={{ flexGrow: 1 }}>
          {title && (
            <Text c="dimmed" tt="uppercase" ta="center" fw={700} fz="xs">
              {title}
            </Text>
          )}
          {value && (
            <Text
              fw={700}
              fz="lg"
              ta="center"
              variant="gradient"
              gradient={{ from: "orange.5", to: "red.9", deg: 90 }}
            >
              {value}
            </Text>
          )}
          {children}
        </div>
      </Group>
    </Paper>
  );
}
