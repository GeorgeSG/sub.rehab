import { useCallback, useEffect, useState } from "react";

const NEW_LINK_THRESHOLD = 1000 * 60 * 60 * 24; // 24 hours

export function useIsLinkNew() {
  const [currentDate, setCurrentDate] = useState<number | null>(null);
  useEffect(() => {
    // Render client-side only
    setCurrentDate(Date.now());
  }, []);

  return useCallback(
    (timestamp?: number | null) =>
      Boolean(currentDate && timestamp && currentDate - timestamp <= NEW_LINK_THRESHOLD),
    [currentDate]
  );
}
