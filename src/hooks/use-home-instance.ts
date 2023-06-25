import { useLocalStorage } from "@mantine/hooks";
import { useCallback, useMemo } from "react";

export function useHomeInstance() {
  /**
   * Whether the home instance feature is enabled
   */
  const [enabled, setEnabled] = useLocalStorage({
    key: "sub-rehab-home-instance-enabled",
    defaultValue: false,
  });

  /**
   * Raw value of the home instance dropdown
   */
  const [rawHomeInstance, setHomeInstance] = useLocalStorage({
    key: "sub-rehab-home-instance",
    defaultValue: "",
  });

  /**
   * Custom home instance URL
   */
  const [customInstanceUrl, setCustomInstanceUrl] = useLocalStorage({
    key: "sub-rehab-home-instance-url",
    defaultValue: "",
  });

  /**
   * Computed homeInstance based on inputs
   */
  const homeInstance = useMemo(() => {
    if (!enabled) {
      return "";
    }

    if (rawHomeInstance === "custom") {
      return customInstanceUrl;
    }

    return rawHomeInstance;
  }, [rawHomeInstance, enabled, customInstanceUrl]);

  /**
   * Home Instance as a URL object with normalized protocol.
   */
  const homeInstanceURL = useMemo(() => {
    if (homeInstance.length === 0) {
      return null;
    }
    let hs = homeInstance.replace("http://", "https://");
    hs = hs.startsWith("https://") ? hs : `https://${hs}`;

    try {
      const url = new URL(hs);
      return url;
    } catch {
      return null;
    }
  }, [homeInstance]);

  /**
   * Returns true if a link is supported by the home instance feature.
   */
  const supportsHomeInstance = useCallback(
    (link: { service: string; url: string }) => {
      if (link.service !== "lemmy" && link.service !== "kbin") {
        return false;
      }

      if (!homeInstanceURL) {
        return false;
      }

      const url = new URL(link.url);
      if (url.host === homeInstanceURL.host) {
        return false;
      }

      if (link.service === "lemmy") {
        return link.url.includes("/c/");
      }

      if (link.service === "kbin") {
        return link.url.includes("/m/");
      }

      return false;
    },
    [homeInstanceURL]
  );

  /**
   * Returns a link to the home instance if the link is supported.
   * Returns the original link otherwise
   */
  const getSubredditLink = useCallback(
    (link: { service: string; url: string }) => {
      if (supportsHomeInstance(link) && homeInstanceURL) {
        const originalUrl = new URL(link.url);
        if (originalUrl.pathname !== "/") {
          return `https://${homeInstanceURL.host}${homeInstanceURL.pathname}${
            originalUrl.pathname.split("/")[2]
          }@${originalUrl.host}`;
        }
      }

      return link.url;
    },
    [homeInstanceURL, supportsHomeInstance]
  );

  return {
    rawHomeInstance,
    homeInstance,
    setHomeInstance,
    supportsHomeInstance,
    getSubredditLink,
    enabled,
    setEnabled,
    customInstanceUrl,
    setCustomInstanceUrl,
  };
}
