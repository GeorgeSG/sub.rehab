import { useFavorites } from "@/hooks/use-favorites";
import data from "@/subreddits";
import { Anchor, Badge, Box, Button, Code, List, Modal, Text, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useCallback, useEffect, useState } from "react";

export function ImportModal({ opened, onClose }: { opened: boolean; onClose(): void }) {
  const [, setFavorites] = useFavorites();

  const [importUrl, setImportUrl] = useState("");
  const [importCount, setImportCount] = useState<number | null>(null);
  const [found, setFound] = useState<string[] | null>(null);

  const onImport = useCallback(() => {
    let importStr = importUrl;
    if (importStr.includes("/r/")) {
      importStr = importStr.split("/r/")[1];
    } else {
      notifications.show({
        title: "Invalid URL",
        message: "Oops. This doesn't look like a valid multireddit URL.",
      });

      return;
    }

    if (importStr.endsWith("/")) {
      importStr = importStr.slice(0, -1);
    }

    const subreddits = importStr.split("+").map((sub) => `r/${sub.trim()}`);
    const existingNames = data.subs.map((sub) => sub.name.toLowerCase());
    setImportCount(subreddits.length);

    const existingSubredditsToSubscribe = subreddits.filter((subscription) =>
      existingNames.includes(subscription.toLowerCase())
    );

    setFound(existingSubredditsToSubscribe);
    setFavorites((prev) => Array.from(new Set([...prev, ...existingSubredditsToSubscribe])));
    setImportUrl("");
  }, [importUrl, setFavorites]);

  useEffect(() => {
    if (opened) {
      setImportCount(null);
      setFound(null);
    }
  }, [opened]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="md" fw="900">
          Import from Reddit
        </Text>
      }
      centered
      size="xl"
    >
      <Box px="xs">
        <List type="ordered" mt="xs">
          <List.Item>
            Login to your reddit account and visit&nbsp;
            <Anchor href="https://reddit.com/reddits" target="_blank" rel="noreferrer">
              reddit.com/reddits
            </Anchor>
            .
          </List.Item>
          <List.Item>
            In the sidebar on the right, click or copy the link of &quot;multireddit of your
            subscriptions&quot;.
          </List.Item>
          <List.Item>Paste the URL of your multireddit in the input below.</List.Item>
        </List>
        <TextInput
          mt="xs"
          placeholder="Multireddit URL"
          value={importUrl}
          onChange={(e) => setImportUrl(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onImport();
            }
          }}
        />
        <Box ml="auto" mt="xs">
          <Button onClick={onImport}>Import</Button>
        </Box>
        {importCount !== null && (
          <Text mt="md" ff="monospace" size="sm">
            Attempting to import&nbsp;
            <Badge component="span" size="md" variant="filled" color="orange">
              {importCount}
            </Badge>
            &nbsp;subreddits…
          </Text>
        )}
        {found !== null && (
          <>
            <Text ff="monospace" size="sm" mt={4}>
              Found&nbsp;
              <Badge component="span" size="md" variant="filled" color="green">
                {found.length}
              </Badge>
              &nbsp;on sub.rehab…
            </Text>
            <Text ff="monospace" size="sm" mt={4}>
              Favorited:
              <Code mt={4} block>
                {found.map((found) => `${found}\n`)}
              </Code>
            </Text>
          </>
        )}
      </Box>
    </Modal>
  );
}
