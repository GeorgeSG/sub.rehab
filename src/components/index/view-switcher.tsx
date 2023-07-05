import { Button } from "@mantine/core";
import { useRouter } from "next/router";
import { IoChatbubbleOutline, IoLogoReddit } from "react-icons/io5";

export function ViewSwitcher({
  view,
  onChange,
}: {
  view: "communities" | "subreddits";
  onChange: (view: "communities" | "subreddits") => void;
}) {
  const router = useRouter();

  return (
    <Button
      variant="subtle"
      size="xs"
      leftIcon={
        view === "subreddits" ? <IoChatbubbleOutline size={18} /> : <IoLogoReddit size={18} />
      }
      onClick={() => onChange(view === "subreddits" ? "communities" : "subreddits")}
    >
      {view === "subreddits" ? "Communities" : "Subreddits"}
    </Button>
  );
}
