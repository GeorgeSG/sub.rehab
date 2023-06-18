import { PageHeader } from "@/components/core/page-header";
import { Section } from "@/components/core/section";
import { Text, Title } from "@mantine/core";
import { BsRobot } from "react-icons/bs";

export default function Error404() {
  return (
    <>
      <PageHeader withBackground />
      <Section sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <BsRobot size="20vw" />
        <Title order={4}>404 - Page Not Found</Title>
      </Section>
    </>
  );
}
