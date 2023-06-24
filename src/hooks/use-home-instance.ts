import { useLocalStorage } from "@mantine/hooks";
import { useMemo } from "react";
import { custom } from "zod";

export function useHomeInstance() {
  const [rawHomeInstance, setHomeInstance] = useLocalStorage({
    key: "sub-rehab-home-instance",
    defaultValue: "",
  });

  const [enabled, setEnabled] = useLocalStorage({
    key: "sub-rehab-home-instance-enabled",
    defaultValue: false,
  });

  const [customInstanceUrl, setCustomInstanceUrl] = useLocalStorage({
    key: "sub-rehab-home-instance-url",
    defaultValue: "",
  });

  const homeInstance = useMemo(() => {
    if (!enabled) {
      return "";
    }

    if (rawHomeInstance === "custom") {
      return customInstanceUrl;
    }

    return rawHomeInstance;
  }, [rawHomeInstance, enabled, customInstanceUrl]);

  return {
    rawHomeInstance,
    homeInstance,
    setHomeInstance,
    enabled,
    setEnabled,
    customInstanceUrl,
    setCustomInstanceUrl,
  };
}
