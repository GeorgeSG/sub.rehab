import { PageHeader } from "@/components/core/page-header";
import { Section } from "@/components/core/section";
import { OriginalInstanceLink } from "@/components/original-instance-link";
import { useHomeInstance } from "@/hooks/use-home-instance";
import {
  Alert,
  Code,
  Flex,
  Select,
  Switch,
  Text,
  TextInput,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import {
  IoAlert,
  IoAlertCircle,
  IoAlertCircleOutline,
  IoCloseOutline,
  IoHomeOutline,
  IoLinkOutline,
  IoMoon,
  IoSunnyOutline,
} from "react-icons/io5";

export default function FAQPage() {
  const instanceOptions = [
    { label: "kbin.social", value: "kbin.social/m/", group: "kbin" },
    { label: "lemmy.world", value: "lemmy.world/c/", group: "lemmy" },
    { label: "lemmy.ml", value: "lemmy.ml/c/", group: "lemmy" },
    { label: "feddit.de", value: "feddit.de/c/", group: "lemmy" },
    { label: "mander.xyz", value: "mander.xyz/c/", group: "lemmy" },
    { label: "lemmy.ca", value: "lemmy.ca/c/", group: "lemmy" },
    { label: "beehaw.org", value: "beehaw.org/c/", group: "lemmy" },
    { label: "programming.dev", value: "programming.dev/c/", group: "lemmy" },
    { label: "sopuli.xyz", value: "sopuli.xyz/c/", group: "lemmy" },
    { label: "custom", value: "custom", group: "custom" },
  ];

  const {
    rawHomeInstance,
    homeInstance,
    setHomeInstance,
    enabled: homeInstanceEnabled,
    setEnabled: setHomeInstanceEnabled,
    customInstanceUrl,
    setCustomInstanceUrl,
  } = useHomeInstance();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <>
      <PageHeader withBackground />
      <Section>
        <Title order={2} mb="lg" sx={{ fontFamily: "var(--font-accent)" }}>
          Settings
        </Title>
        <Switch
          checked={colorScheme === "dark"}
          onChange={() => toggleColorScheme()}
          labelPosition="left"
          label="Dark mode:"
          color="indigo"
          onLabel={<IoSunnyOutline size={14} />}
          offLabel={<IoMoon size={12} />}
        />
        <Title order={2} mt={40} sx={{ fontFamily: "var(--font-accent)" }}>
          Home Instance
        </Title>
        <Alert
          icon={<IoAlertCircleOutline size={20} />}
          mt="lg"
          color="orange"
          variant="outline"
          title="This is an experimental feature!"
        >
          <Text>
            Lemmy and Kbin users - you can set a Home Instance for links to Kbin and Lemmy
            communities.
          </Text>
          <Text mt="sm">
            If configured, sub.rehab will format Lemmy and Kbin links to point to your instance. For
            example, if your home instance is <Code color="orange">lemmy.world</Code> and you try to
            visit&nbsp;
            <Code color="orange">kbin.social/m/baking</Code>, it will instead link to&nbsp;
            <Code color="orange">lemmy.world/c/baking@kbin.social</Code>.
          </Text>
          <Text mt="sm">
            Links will not work if your home instance is not federated with the community
            you&apos;re trying to visit. In that case, you can use the&nbsp;
            <OriginalInstanceLink url="#" style={{ display: "inline" }} /> icon to visit the
            community on their original home instance.
          </Text>
        </Alert>
        <Flex maw={400} direction="column" gap="md" mt="lg">
          <Switch
            checked={homeInstanceEnabled}
            onChange={() => setHomeInstanceEnabled((prev) => !prev)}
            labelPosition="left"
            label="Enabled:"
          />
          <Select
            searchable
            withinPortal
            data={instanceOptions}
            placeholder="Select an instance"
            value={rawHomeInstance}
            label="Instance:"
            onChange={(e) => e && setHomeInstance(e)}
            icon={<IoHomeOutline />}
          />
          {rawHomeInstance === "custom" && (
            <>
              <Text size="sm">
                Set a custom instance URL in the format:&nbsp;
                <Code color="oragne">&lt;domain.name&gt;/&lt;community-prefix&gt;/</Code>
              </Text>
              <Text size="sm">
                Example: <Code color="orange">lemmy.world/c/</Code>
              </Text>
              <TextInput
                placeholder="lemmy.world/c/"
                value={customInstanceUrl}
                label="Custom Instance:"
                onChange={(e) => setCustomInstanceUrl(e.currentTarget.value)}
                icon={<IoLinkOutline />}
                rightSection={<IoCloseOutline onClick={() => setCustomInstanceUrl("")} />}
              />
            </>
          )}
        </Flex>
      </Section>
    </>
  );
}
