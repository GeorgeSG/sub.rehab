import { useFavorites } from "@/hooks/use-favorites";
import { Button, Flex, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";
import { IoAddCircleOutline, IoTrashOutline } from "react-icons/io5";
import { ImportModal } from "./import-modal";

export function SettingsFavorites() {
  const [importOpen, setImportOpen] = useState(false);
  const [, setFavorites] = useFavorites();

  return (
    <>
      <Flex align="center" mt="lg" gap="md">
        <Button
          variant="outline"
          leftIcon={<IoAddCircleOutline size={18} />}
          onClick={() => setImportOpen(true)}
        >
          Import from Reddit
        </Button>
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
              children: "This will reset all your favorited subreddits and cannot be undone.",
              centered: true,
              cancelProps: { children: "No, keep my favorites" },
              confirmProps: { color: "red", children: "Yes, delete all favorites!" },
              onConfirm: () => setFavorites([]),
            });
          }}
        >
          Reset Favorites
        </Button>
      </Flex>
      <ImportModal opened={importOpen} onClose={() => setImportOpen(false)} />
    </>
  );
}
