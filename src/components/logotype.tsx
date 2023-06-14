import { Anchor, Title, TitleProps } from "@mantine/core";
import Link from "next/link";

export function Logotype(props: TitleProps) {
  return (
    <Anchor component={Link} href="/">
      <Title
        variant="gradient"
        gradient={{ from: "orange.5", to: "red.9", deg: 135 }}
        size="max(4vw, 2rem)"
        sx={{ fontFamily: "var(--font-accent)" }}
        {...props}
      >
        sub.rehab
      </Title>
    </Anchor>
  );
}
