import { ActionIcon, Tooltip } from "@mantine/core";
import { CSSProperties } from "react";
import { IoShareOutline } from "react-icons/io5";

export function OriginalInstanceLink({
  url,
  style = { marginLeft: "auto" },
}: {
  url: string;
  style?: CSSProperties;
}) {
  return (
    <Tooltip label="Visit on original instance" withArrow position="top">
      <ActionIcon
        color="gray"
        component={"a"}
        href={url ?? "asd"}
        target="_blank"
        title={url}
        style={style}
      >
        <IoShareOutline />
      </ActionIcon>
    </Tooltip>
  );
}
