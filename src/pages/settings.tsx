import { PageHeader } from "@/components/core/page-header";
import { Section } from "@/components/core/section";
import { OriginalInstanceLink } from "@/components/original-instance-link";
import { SettingsFavorites } from "@/components/settings/settings-favorites";
import { useHomeInstance } from "@/hooks/use-home-instance";
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Code,
  Flex,
  Indicator,
  Select,
  Switch,
  Text,
  TextInput,
  Title,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IoAlertCircleOutline,
  IoCloseOutline,
  IoHelpCircleOutline,
  IoHelpOutline,
  IoHomeOutline,
  IoLinkOutline,
  IoMoon,
  IoSunnyOutline,
  IoTrashOutline,
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
          Favorites
        </Title>
        <SettingsFavorites />
        <Flex align="center" mt={40} gap="xs">
          <Title order={2} sx={{ fontFamily: "var(--font-accent)" }}>
            Home Instance
          </Title>
          <Tooltip label="What is a Home Instance?" withArrow>
            <ActionIcon
              onClick={() =>
                modals.open({
                  title: (
                    <Text size="md" fw="900">
                      Home Instance help
                    </Text>
                  ),
                  centered: true,
                  size: "lg",
                  children: (
                    <>
                      <Text>
                        Lemmy and Kbin users - you can set a Home Instance for links to Kbin and
                        Lemmy communities.
                      </Text>
                      <Text mt="sm">
                        If configured, sub.rehab will format Lemmy and Kbin links to point to your
                        instance. For example, if your home instance is{" "}
                        <Code color="orange">lemmy.world</Code> and you try to visit&nbsp;
                        <Code color="orange">kbin.social/m/baking</Code>, it will instead link
                        to&nbsp;
                        <Code color="orange">lemmy.world/c/baking@kbin.social</Code>.
                      </Text>
                      <Text mt="sm">
                        <strong>Note:</strong> Links will not work if your home instance is not
                        federated with the community you&apos;re trying to visit. In that case, you
                        can use the&nbsp;
                        <OriginalInstanceLink url="#" style={{ display: "inline" }} /> icon to visit
                        the community on their original home instance.
                      </Text>
                    </>
                  ),
                })
              }
            >
              <IoHelpCircleOutline />
            </ActionIcon>
          </Tooltip>
        </Flex>

        <Flex maw={400} direction="column" gap="md" mt="lg">
          <Switch
            checked={homeInstanceEnabled}
            onChange={() => {
              setHomeInstanceEnabled((prev) => {
                umami.track("setHomeInstanceEnabled", { enabled: (!prev).toString() });
                return !prev;
              });
            }}
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
            onChange={(e) => {
              if (e) {
                setHomeInstance(e);
                umami.track("setHomeInstance", { instance: e });
              }
            }}
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
        <Title order={2} mb="lg" mt={40} sx={{ fontFamily: "var(--font-accent)" }}>
          Data
        </Title>
        <Button
          variant="outline"
          color="red"
          leftIcon={<IoTrashOutline size={17} />}
          onClick={() => {
            modals.openConfirmModal({
              title: (
                <Text size="md" fw="900">
                  Are you sure?
                </Text>
              ),
              children:
                "This will reset all configuration persisted in the browser's local storage and clear your favorites.",
              centered: true,
              cancelProps: { children: "No, thanks" },
              confirmProps: { color: "red", children: "Yes, delete all browser data!" },
              onConfirm: () => localStorage.clear(),
            });
          }}
        >
          Reset configuration
        </Button>
      </Section>
    </>
  );
}
